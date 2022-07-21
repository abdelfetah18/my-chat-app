const express = require('express');
const next = require('next');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const ws_server = require('ws');
var cookieParser = require('cookie-parser')
var jwt = require('jsonwebtoken');
var fs = require('fs');
var privateKEY  = fs.readFileSync(__dirname+'/secret/private.key', 'utf8');
var publicKEY  = fs.readFileSync(__dirname+'/secret/public.key', 'utf8');
var { addData,getData,updateData,uploadCover,uploadProfile } = require('./database/client');
var multer = require('multer');
var upload_profile_image = multer({ dest:'./uploads/profile_images' });
var upload_cover_image = multer({ dest:'./uploads/cover_images' });

app.prepare().then(() => {
    const server = express();
    
    server.use(cookieParser());

    server.use('/api/v1/', (req, res, nextR) => {
        var protected_paths = ['/create','/delete','/edit','/invite','/join','/leave'];
        if(protected_paths.includes(req.path)){
            var token = req.headers.authorization;
            if(token != undefined){
                jwt.verify(token,privateKEY,{ algorithms:'RS256' },(err,data) => {
                    if(err){
                        res.status(200).json({
                            status:'error',
                            error:err
                        });
                    }else{
                        req.decoded_jwt = data;
                        nextR();
                    }
                });
            }else{
                res.status(401).json({
                    message:'not authorized!'
                });
            }
        }else{
            nextR();
        }
    });

    server.use('/api/v1/sign_in', ( req, res, nextR ) => {
        if(req.method == "POST"){
            nextR();
        }else{
            res.status(405).json({ message:'method not allowed!' });
        }
    });

    server.use('/api/v1/user/',( req, res, nextR) => {
        if(req.cookies.access_token != undefined){
            jwt.verify(req.cookies.access_token,privateKEY,{ algorithms:'RS256' },(err,data) => {
                if(err){
                    res.status(200).json({
                        status:'error',
                        error:err
                    });
                }else{
                    req.decoded_jwt = data;
                    nextR();
                }
            });
        }else{
            res.status(401).redirect('/sign_in');
        }
    });

    server.use('/api/v1/room/',( req, res, nextR) => {
        if(req.cookies.access_token != undefined){
            jwt.verify(req.cookies.access_token,privateKEY,{ algorithms:'RS256' },(err,data) => {
                if(err){
                    res.status(200).json({
                        status:'error',
                        error:err
                    });
                }else{
                    req.decoded_jwt = data;
                    nextR();
                }
            });
        }else{
            res.status(401).redirect('/sign_in');
        }
    });

    server.use('/chat/:user_id',( req, res, nextR) => {
        if(req.cookies.access_token != undefined){
            jwt.verify(req.cookies.access_token,privateKEY,{ algorithms:'RS256' },(err,data) => {
                if(err){
                    res.status(200).json({
                        status:'error',
                        error:err
                    });
                }else{
                    req.decoded_jwt = data;
                    nextR();
                }
            });
        }else{
            res.status(401).redirect('/sign_in');
        }
    });

    server.use('/rooms/:room_id',( req, res, nextR) => {
        if(req.cookies.access_token != undefined){
            jwt.verify(req.cookies.access_token,privateKEY,{ algorithms:'RS256' },(err,data) => {
                if(err){
                    res.status(200).json({
                        status:'error',
                        error:err
                    });
                }else{
                    req.decoded_jwt = data;
                    nextR();
                }
            });
        }else{
            res.status(401).redirect('/sign_in');
        }
    });

    server.post('/api/v1/upload_profile_image',upload_profile_image.single('profile_image'),async ( req, res) => {
        var { user_id } = req.body;
        try {
            var asset = await uploadProfile(__dirname+'/'+req.file.path,user_id);
            res.setHeader('Access-Control-Allow-Origin','*');
            res.status(200).json({
                status:'success',
                message:'uploaded successfuly!',
                ...asset
            })
        } catch(err){
            console.log('err:',err)
        }
        
    });

    server.post('/api/v1/upload_cover_image',upload_cover_image.single('cover_image'),async ( req, res) => {
        var { user_id } = req.body;
        try {
            var asset = await uploadCover(__dirname+'/'+req.file.path,user_id);
            res.setHeader('Access-Control-Allow-Origin','*');
            res.status(200).json({
                status:'success',
                message:'uploaded successfuly!',
                ...asset
            })
        } catch(err){
            console.log('err:',err)
        }
        
    });

    server.use('/', ( req, res, nextR) => {
        var protected_paths = ['/','/home','/create_room','/chat','/rooms','/settings'];
        if(protected_paths.includes(req.path)){
            if(req.cookies.access_token != undefined){
                jwt.verify(req.cookies.access_token,privateKEY,{ algorithms:'RS256' },(err,data) => {
                    if(err){
                        res.status(200).json({
                            status:'error',
                            error:err
                        });
                    }else{
                        req.decoded_jwt = data;
                        nextR();
                    }
                });
            }else{
                res.status(401).redirect('/sign_in');
            }
        }else{
            nextR();
        }
    });

    server.post('*/*', (req, res) => {
        return handle(req, res);
    });
    
    server.get('*/*', (req, res) => {
        return handle(req, res);
    });

    var my_server = server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });

    var ws = process.env.NODE_ENV ? new ws_server.Server({ server:my_server },() => console.log('websocket alive!')) : new ws_server.Server({ /*server:my_server,*/port:4000 },() => console.log('websocket alive!'));
    var ONLINE_USERS = new Map();
    var ONLINE_ROOMS = new Map();

    ws.on('connection',(socket,request) => {
        var url = new URL("ws://"+request.headers.host+request.url);
        socket._url = url;
        var token = decodeURI(url.searchParams.get('access_token'));
        jwt.verify(token,privateKEY,{ algorithms:'RS256' },(err,data) => {
            if(err){
                console.log('error:',err);
                socket.close();
            }else{
                socket.user_info = data;
                console.log('new user connected!');
                var type = url.searchParams.get('type');
                var room_id = url.searchParams.get('room_id');
                switch(type){
                    case "room":
                        var room = ONLINE_ROOMS.get(room_id);
                        if(room != undefined){
                            ONLINE_ROOMS.set(room_id,[...room,socket]);
                        }else{
                            ONLINE_ROOMS.set(room_id,[socket]);
                        }
                        console.log('room_users:',ONLINE_ROOMS.get(room_id).length);
                        break;
                    case "chat":
                        ONLINE_USERS.set(data.user_id,socket);
                        break;
                    default:
                        socket.close();
                        break;
                }
            }
        });

        socket.broadcast = (eventName,payload) => {
            socket.send(JSON.stringify({ eventName,payload }));
        }
        
        socket.on('close',(code,reason) => {
            var type = socket._url.searchParams.get('type');
            switch(type){
                case "room":
                    var save_list = [];
                    ONLINE_USERS.delete(socket.user_info.user_id);
                    ONLINE_ROOMS.get(socket._url.searchParams.get('room_id')).forEach((u) => {
                        if(u.user_info.user_id != socket.user_info.user_id){
                            save_list.push(u);
                        }
                    })
                    ONLINE_ROOMS.set(socket._url.searchParams.get('room_id'),save_list);
                    break;
                case "chat":
                    ONLINE_USERS.delete(socket.user_info.user_id);
                    break;
                default:
                    break;
            }
            
            
            console.log('user disconnected!');
        })

        socket.on('message',(data,isBinary) => {
            var { eventName,payload } = JSON.parse(data.toString());
            console.log(eventName,'=>',payload);
            socket.emit(eventName,payload);
        });

        socket.on('msg',(payload) => {
            var { chat_id,message,type } = payload;
            getData("*[_type=='chats' && state=='accept' && _id == $chat_id && (inviter._ref == $user_id || user._ref == $user_id)]",{ chat_id,user_id:socket.user_info.user_id }).then((result) => {
                console.log('result:',result);
                if(result.length > 0){
                    addData({
                        _type:"messages",
                        chat: { _ref:result[0]._id },
                        user:{ _ref:socket.user_info.user_id },
                        message,
                        type
                    }).then((r) => {
                        console.log('r:',r);
                        var u = ONLINE_USERS.get((result[0].user._ref != socket.user_info.user_id) ? result[0].user._ref : result[0].inviter._ref);
                        if(u != undefined){
                            u.broadcast('msg',r);
                        }
                    }).catch((err) => {
                        console.log("addData err:",err);
                    });
                }
            }).catch((err) => {
                console.log("getData err:",err);
            });
        });

        socket.on('room-msg',(payload) => {
            var { room_id,message,type } = payload;
            getData("*[_type=='room_members' && state=='accept' && member._ref==$user_id && room._ref == $room_id]",{ room_id,user_id:socket.user_info.user_id }).then((result) => {
                if(result.length > 0){
                    addData({
                        _type:"room_messages",
                        room: { _ref:room_id },
                        user:{ _ref:socket.user_info.user_id },
                        message,
                        type
                    }).then((r) => {
                        var room = ONLINE_ROOMS.get(room_id);
                        if(room != undefined){
                            room.forEach(u => {
                                if(u.user_info.user_id != socket.user_info.user_id){
                                    console.log('send to:',u.user_info.username);
                                    u.broadcast('room-msg',r);
                                }
                            });
                        }
                    }).catch((err) => {
                        console.log("addData err:",err);
                    });
                }
            }).catch((err) => {
                console.log("getData err:",err);
            });
        });
    });
    
}).catch((err) => console.log('error:',err));