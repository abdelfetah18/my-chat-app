interface User {
    _id?: string;
    username: string;
    bio: string;
    profile_image?: Asset;
    cover_image?: Asset;
    rooms?: number;
    friends?: number;
    _createdAt?: string;
    birthdate?: string;
    email?: string;
    password?: string;
}

import DatabaseClient, { RefDocument } from "./DatabaseClient";

export default class Users {
    client: DatabaseClient;

    getUser(user_id: string) : Promise<User>;
    getByUsername(username: string) : Promise<User>;
    updateUser(user_id: string, user: User) : Promise<User>;
    uploadProfileImage(user_id: string,file_Path: string) : Promise<Asset>;
    uploadCoverImage(user_id: string,file_Path: string) : Promise<Asset>;
    // createUser
    // getUser
    // getExplorePeople
    // getUserWithPassword
}