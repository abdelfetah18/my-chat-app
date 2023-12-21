This is a chat app using `NextJS`,`TailWindCSS` and `Sanity.io`.

preview: [https://my-chat-app.onrender.com/](https://my-chat-app.onrender.com/)


## Features
1. Profile (every user has a username , bio, profile picture and cover picture).
2. Friends (every user can invite friends, accept or reject them).
3. Direct Message (every user can DM his friend).
4. Rooms (every user has the ability to create room and customize it and invite his frineds to join).
5. Emoji picker where you can express your feeling with emojis.

## Technology used in this app
For the database i am using [`sanity.io`](https://sanity.io) , ( `Sanity` is the unified content platform that lets your team work together in real-time to build engaging digital experiences across channels. )



![database](https://raw.githubusercontent.com/abdelfetah18/my-chat-app/master/public/my-chat-app.png)


---

For Authentication and Authorization i am using `JWT (JSON Web Token)`.i am using it in middlewares.

---

Also i am using `Rest API` in a way that let me to build a mobile app.

---

For RealTime chat , I am using `WebSocket`.it System Design is based on Events. like when WebSocketServer Recieve a data will emit a event, and there is a Listner which will consume the data.the same stratigy for the Client.

---

## Images from the app
![1](https://raw.githubusercontent.com/abdelfetah18/my-chat-app/master/public/ui/1.png)
![2](https://raw.githubusercontent.com/abdelfetah18/my-chat-app/master/public/ui/2.png)
![3](https://raw.githubusercontent.com/abdelfetah18/my-chat-app/master/public/ui/3.png)
![4](https://raw.githubusercontent.com/abdelfetah18/my-chat-app/master/public/ui/4.png)
![5](https://raw.githubusercontent.com/abdelfetah18/my-chat-app/master/public/ui/5.png)


Thanks for reading and see you in my next project.
