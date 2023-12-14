import { client } from "./database/client";
import ChatMembersRepository from "./libs/repositories/ChatMembersRepository";
import ChatsRepository from "./libs/repositories/ChatsRepository";
import DBClient from "./libs/database/DatabaseClient";
import RoomMembersRepository from "./libs/repositories/RoomMembersRepository";
import RoomsRepository from "./libs/repositories/RoomsRepository";
import UsersRepository from "./libs/repositories/UsersRepository";
import MessagesRepository from "./libs/repositories/MessagesRepository";
import UsersSessionsRepository from "./libs/repositories/UserSessionRepository";
import FriendsRepository from "./libs/repositories/FriendsRepository";

const dbClient = new DBClient(client);

const usersRepository = new UsersRepository(dbClient);
const roomsRepository = new RoomsRepository(dbClient);
const chatsRepository = new ChatsRepository(dbClient);
const roomMembersRepository = new RoomMembersRepository(dbClient);
const chatMembersRepository = new ChatMembersRepository(dbClient);
const messagesRepository = new MessagesRepository(dbClient);
const usersSessionsRepository = new UsersSessionsRepository(dbClient);
const friendsRepository = new FriendsRepository(dbClient);


export {
    usersRepository,
    roomsRepository,
    chatsRepository,
    roomMembersRepository,
    chatMembersRepository,
    messagesRepository,
    usersSessionsRepository,
    friendsRepository
};