const sanityClient = require('@sanity/client');

const client = sanityClient({
  projectId: 'r6dylyos',
  dataset: 'production',
  apiVersion: '2023-07-01',
  token: process.env.SANITY_TOEKN,
  useCdn: false,
});

async function deleteQuery(query, params){
  try {
    let data = await client.delete({ query, params });
    return data;
  } catch (err) {
    return err;
  }
}


let { basename } = require('path');
let { createReadStream } = require('fs');

async function getData(query,params){
  return await client.fetch(query, params);
}

async function addData(doc){
  return await client.create(doc);
}

async function updateData(doc_id,new_doc){
  return await client.patch(doc_id).set(new_doc).commit();
}

async function uploadProfile(filePath, doc_id){
  try {
    let imageAsset = await client.assets.upload('image', createReadStream(filePath),{ filename: basename(filePath) });
    let doc_info = await client.patch(doc_id).set({
      profile_image: {
        _type: 'image',
        asset: {
          _type: "reference",
          _ref: imageAsset._id
        }
      }
    }).commit();
    return { ...doc_info, profile_image: imageAsset };
  }catch(err) {
    console.log('db_error:',err)
  }
}

async function uploadCover(filePath, doc_id){
  try {
    let imageAsset = await client.assets.upload('image', createReadStream(filePath),{ filename: basename(filePath) });
    let doc_info = await client.patch(doc_id).set({
      cover_image: {
        _type: 'image',
        asset: {
          _type: "reference",
          _ref: imageAsset._id
        }
      }
    }).commit();
    return { ...doc_info,cover_image:imageAsset };
  }catch(err) {
    console.log('db_error:',err)
  }
}

async function uploadImage(filePath){
  try {
    let imageAsset = await client.assets.upload('image', createReadStream(filePath),{ filename: basename(filePath) });
    return { image:imageAsset }
  } catch(err) {
    console.log('db_error:',err)
  }
}

const user_props = '{ _id, username, "profile_image": profile_image.asset->url, "cover_image": cover_image.asset->url, bio, _createdAt, "rooms": count(*[_type=="room_member" && user._ref==^._id]), "friends": count(*[_type=="friend" && (user._ref==^._id || inviter._ref==^._id) && state=="accept"]) }';
const user_with_password_props = '{ _id, username, password,"profile_image": profile_image.asset->url, "cover_image": cover_image.asset->url, bio, _createdAt }';
const friend_props = '{ _id, "inviter": inviter->'+user_props+', "user": user->'+user_props+', state, _createdAt }';
const chat_props = '{ _id, theme, _createdAt }';
const chat_member_props = '{ _id, "chat": chat->'+chat_props+', "user": user->'+user_props+', _createdAt }';
const room_props = '{ _id, name, "chat": chat->'+chat_props+', "profile_image": profile_image.asset->url, "cover_image": cover_image.asset->url, bio, is_public, "admin": admin->'+user_props+', _createdAt, "total_members": count(*[_type=="room_member" && room._ref==^._id]) }';
const message_props = '{ _id, "chat": chat->'+chat_props+', "user": user->'+user_props+', message_content, message_type, _createdAt }';
const room_member_props = '{ "room": room->'+room_props+', "user": user->'+user_props+', _createdAt }';


/*

  CURRENT_VERSION:
    users: username, birthdate, bio, profile_image, cover_image
    rooms: name, profile_image, cover_image, bio, admin, creator
    chats: inviter, user, state
    messages: chat, user, message, type
    room_messages: room, user, message, type
    room_members: room, member, role, state

*/

/*

UPDATED_VERSION:
    user: user_id, username, email, birthdate, bio, profile_image, cover_image
    friend: _id, ->inviter_id, ->user_id, state
    chat: chat_id, theme
    chat_member: ->chat_id, ->user_id
    room: ->chat_id, name, profile_image, cover_image, bio, ->admin_id
    message: ->chat_id, ->user_id, message_content, type
    room_member: ->room_id, ->user_id
*/

async function getUser(user_id){
  try {
    let user = await getData('*[_type=="user" && (_id==$user_id || username == $user_id)][0]'+ user_props,{ user_id });
    return user;
  }catch(err){
    console.error("DATABASE Error:", err);
    return null;
  }
}


async function getRoom(room_id){
  try {
    let room = await getData('*[_type=="room" && (_id==$room_id  || name == $room_id)][0]'+ room_props,{ room_id });
    return room;
  }catch(err){
    console.error("DATABASE Error:", err);
    return null;
  }
}

async function getRooms(user_id){
  try {
    let rooms = await getData('*[_type=="room" && _id in *[_type=="room_member" && user._ref==$user_id].room._ref]'+ room_props,{ user_id });
    return rooms;
  }catch(err){
    console.error("DATABASE Error:", err);
    return null;
  }
}

async function getRecentChats(user_id){
  try {
    let query = `*[_type=="chat" && _id in *[_type=="chat_member" && user._ref==$user_id].chat._ref && count(*[_type=="message" && chat._ref==^._id]) > 0]{
      "chat_id": _id,
      "message": *[_type=="message" && chat._ref==^._id] | order(_createdAt desc)[0]`+message_props+`,
      ...select(
        count(*[_type=="room" && chat._ref==^._id]) > 0 => *[_type=="room" && chat._ref==^._id][0]`+room_props+`,
        count(*[_type=="chat_member" && chat._ref==^._id]) == 2 => *[_type=="chat_member" && chat._ref==^._id && user._ref!=$user_id][0].user->`+user_props+`
      )
    }`;
    let chats = await getData(query,{ user_id });
    return chats;
  }catch(err){
    console.error("DATABASE Error:", err);
    return null;
  }
}

async function getChatsByName(name, user_id){
  try {
    let query = `*[_type=="chat" && _id in *[_type=="chat_member" && user._ref==$user_id].chat._ref]{
      "chat_id": _id,
      "message": *[_type=="message" && chat._ref==^._id] | order(_createdAt desc)[0]`+message_props+`,
      ...select(
        count(*[_type=="room" && chat._ref==^._id]) > 0 => *[_type=="room" && chat._ref==^._id && name match '*'+$name+'*'][0]`+room_props+`,
        count(*[_type=="chat_member" && chat._ref==^._id]) == 2 => *[_type=="chat_member" && chat._ref==^._id && user._ref!=$user_id && user->username match '*'+$name+'*'][0].user->`+user_props+`
      )
    }`;
    let chats = await getData(query,{ user_id, name });
    return chats;
  }catch(err){
    console.error("DATABASE Error:", err);
    return null;
  }
}

async function getChat(user_id, chat_id){
  try {
    const query = `*[_type=="chat" && _id==$chat_id]{
      "chat_id": _id,
      "messages": *[_type=="message" && chat._ref==^._id]`+message_props+` | order(_createdAt asc),
      ...select(
        count(*[_type=="room" && chat._ref==^._id]) > 0 => *[_type=="room" && chat._ref==^._id][0]`+room_props+`,
        count(*[_type=="chat_member" && chat._ref==^._id]) == 2 => *[_type=="chat_member" && chat._ref==^._id && user._ref!=$user_id][0].user->`+user_props+`
      )
    }[0]`;
    let chat = await getData(query,{ user_id, chat_id });
    return chat;
  }catch(err){
    console.error("DATABASE Error:", err);
    return null;
  }
}


async function getUserWithPassword(user_id){
  try {
    let user = await getData('*[_type=="user" && (_id==$user_id || username == $user_id)][0]'+ user_with_password_props,{ user_id });
    return user;
  }catch(err){
    console.error("DATABASE Error:", err);
    return null;
  }
}

async function getExploreRooms(user_id){
  // Rooms that user is not in yet
  try {
    let rooms_you_may_like = await getData('*[_type=="room" && !(_id in *[_type=="room_member" && user._ref == $user_id].room._ref)]'+room_props,{ user_id });
    return rooms_you_may_like;
  }catch(err){
    return null;
  }
}

async function getExplorePeople(user_id){
  // People that user not chat or sent a request to.
  try {
    let people_may_know = await getData('*[_type=="user" && _id != $user_id && !(_id in [...*[_type=="friend" && (user._ref == $user_id)].inviter._ref,...*[_type=="friend" && (inviter._ref == $user_id)].user._ref])]'+user_props, { user_id });
    return people_may_know;
  }catch(err){
    console.error("DATABASE Error:", err);
    return null;
  }
}

async function getFriendRequests(user_id){
  // Friends requests
  try {
    let requests = await getData('*[_type=="friend" && user._ref == $user_id && state=="request"]'+friend_props, { user_id });
    return requests;
  }catch(err){
    console.error("DATABASE Error:", err);
    return null;
  }
}

async function createUser(user){
  let user_ = await getUser(user.username);
  if(user_)
    return null;
  
  let data = await addData({  _type:'user', ...user });
  return data;
}

async function createRoom(room){
  let room_ = await getRoom(room.name);
  if(room_)
    return null;
  
  let data = await addData({  _type:'room', ...room });
  return data;
}

async function createMessage(message){
  let message_ = await addData({  _type:'message', ...message });
  return message_;
}

async function createChat(){
  let data = await addData({  _type:'chat', theme: "light" });
  return data;
}

async function updateRoom(room_id, room){
  let data = await updateData(room_id, room);
  return data;
}

async function updateUser(user_id, user){
  let data = await updateData(user_id, user);
  return data;
}

async function addFriend(user_id, friend_id){
  let friend = await addData({ _type: "friend", inviter: { _type: "reference", _ref: user_id }, user: { _type: "reference", _ref: friend_id }, state: "request" });
  return friend;
}

async function addMember(room_id, user_id){
  let member = await addData({ _type: "room_member", room: { _type: "reference", _ref: room_id }, user: { _type: "reference", _ref: user_id }});
  return member;
}

async function addChatMember(chat_id, user_id){
  let member = await addData({ _type: "chat_member", chat: { _type: "reference", _ref: chat_id }, user: { _type: "reference", _ref: user_id }});
  return member;
}

async function acceptFriend(id){
  let friend = await updateData(id,{ state: "accept" });
  return friend;
}

async function rejectFriend(id){
  let friend = await updateData(id,{ state: "reject" });
  return friend;
}

async function removeChatMember(chat_id, user_id){
  let chat_member = await deleteQuery("*[_type=='chat_member' && user._ref==$user_id && chat._ref==$chat_id]", { chat_id, user_id });
  return chat_member;
}

async function removeMember(room_id, user_id){
  let member = await deleteQuery("*[_type=='room_member' && user._ref==$user_id && room._ref==$room_id]", { room_id, user_id });
  return member;
}

// Delete room members
async function deleteRoomMembers(room_id){
  let room = await deleteQuery("*[_type=='room_member' && room._ref==$room_id]", { room_id });
  return room;
}

// Delete chat messages
async function deleteChatMessages(chat_id){
  let room = await deleteQuery("*[_type=='message' && chat._ref==$chat_id]", { chat_id });
  return room;
}

// Delete chat members
async function deleteChatMembers(chat_id){
  let room = await deleteQuery("*[_type=='chat_member' && chat._ref==$chat_id]", { chat_id });
  return room;
}

// Delete chat
async function deleteChat(chat_id){
  let chat = await deleteQuery("*[_type=='chat' && _id==$chat_id]", { chat_id });
  return chat;
}

// Delete room
async function deleteRoom(room_id){
  let room = await deleteQuery("*[_type=='room' && _id==$room_id]", { room_id });
  return room;
}

module.exports = {
  getExplorePeople,
  getExploreRooms,
  getFriendRequests,
  getUser,
  getRoom,
  getRooms,
  getUserWithPassword,
  getRecentChats,
  getChatsByName,
  getChat,
  createUser,
  createRoom,
  createMessage,
  createChat,
  addFriend,
  addMember,
  addChatMember,
  acceptFriend,
  rejectFriend,
  updateRoom,
  updateUser,
  removeChatMember,
  removeMember,
  deleteChat,
  deleteChatMembers,
  deleteChatMessages,
  deleteRoom,
  deleteRoomMembers,

  updateData,
  getData,
  addData,
  uploadProfile,
  uploadCover,
  uploadImage,
  deleteQuery
};