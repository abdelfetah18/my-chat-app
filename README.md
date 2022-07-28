This is a chat app using `NextJS`,`TailWindCSS` and `Sanity.io`.

## Getting Started

First, build the files:

```bash
npm run build
```
and then run the server:
```bash
npm run start
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features
1. Profile (every user has a username , bio, profile picture and cover picture).
2. Friends (every user can invite friends, accept or reject them).
3. Direct Message (every user can DM his friend).
4. Rooms (every user has the ability to create room and customize it and invite his frineds to join).

## Technology used in this app
For the database i am using [`sanity.io`](https://sanity.io) , ( `Sanity` is the unified content platform that lets your team work together in real-time to build engaging digital experiences across channels. )


```
- users:
    - user_id
    - username
    - birthdate
    - profile_image
    - cover_image
    - bio
    - password
    - updated_at
    - created_at
```
```
- rooms:
    - room_id
    - room_name
    - room_profile_image
    - room_cover_image
    - room_bio
    - room_admin_id
    - room _creator_id
    - updated_at
    - created_at
```
```
- chats:
    - chat_id
    - inviter_id
    - user_id
    - state
    - created_at
```
```
- messages:
    - message_id
    - chat_id
    - user_id
    - message
    - type
    - created_at
```
```
- room_messages:
    - message_id
    - room_id
    - user_id
    - message
    - type
    - created_at
```
```
- room_members:
    - record_id
    - member_id
    - role
    - state 
    - updated_at
    - created_at
```

---

For Authentication and Authorization i am using `JWT (JSON Web Token)`.i am using it in middlewares.

---

Also i am using `Rest API` in a way that let me to build a mobile app.

---

For RealTime chat , I am using `WebSocket`.it System Design is based on Events. like when WebSocketServer Recieve a data will emit a event, and there is a Listner which will consume the data.the same stratigy for the Client.

---

## Images from the app
![1](https://raw.githubusercontent.com/abdelfetah18/my-chat-app/master/public/1.png)
![2](https://raw.githubusercontent.com/abdelfetah18/my-chat-app/master/public/2.png)
![3](https://raw.githubusercontent.com/abdelfetah18/my-chat-app/master/public/3.png)
![4](https://raw.githubusercontent.com/abdelfetah18/my-chat-app/master/public/4.png)
![5](https://raw.githubusercontent.com/abdelfetah18/my-chat-app/master/public/5.png)
![6](https://raw.githubusercontent.com/abdelfetah18/my-chat-app/master/public/6.png)
![7](https://raw.githubusercontent.com/abdelfetah18/my-chat-app/master/public/7.png)


Thanks for reading and see you in my next project.