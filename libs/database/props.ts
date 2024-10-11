export const ASSET_PROPS = `{ url }`;
export const USER_PROPS = `{ _id, username, "profile_image": profile_image.asset->${ASSET_PROPS}, "cover_image": cover_image.asset->${ASSET_PROPS}, bio, _createdAt, "rooms": count(*[_type=="room_member" && user._ref==^._id]), "friends": count(*[_type=="friend" && (user._ref==^._id || inviter._ref==^._id) && state=="accept"]) }`;
export const CHAT_PROPS = `{ _id, theme, _createdAt }`;
export const MESSAGE_PROPS = `{ _id, "chat": chat->, "user": user->${USER_PROPS}, message_content, message_type, "message_image": message_image.asset->${ASSET_PROPS}, _createdAt }`;
export const ROOM_PROPS = `{ _id, name, "chat": chat->, "profile_image": profile_image.asset->${ASSET_PROPS}, "cover_image": cover_image.asset->${ASSET_PROPS}, bio, is_public, "admin": admin->${USER_PROPS}, "total_members": count(*[_type=="room_member" && room._ref==^._id]), _createdAt }`;
export const ROOM_MEMBER_PROPS = `{ _id, "room": room->${ROOM_PROPS}, "user": user->${USER_PROPS}, role, _createdAt }`;
export const FRIEND_PROPS = '{ _id, "inviter": inviter->' + USER_PROPS + ', "user": user->' + USER_PROPS + ', state, _createdAt, "chat": *[_type=="chat" && (_id in *[_type=="chat_member" && user._ref==^.^.user._ref].chat._ref) && (_id in *[_type=="chat_member" && user._ref==^.^.inviter._ref].chat._ref)][0]' + CHAT_PROPS + ' }';
