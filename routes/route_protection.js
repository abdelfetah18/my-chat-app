let jwt = require('jsonwebtoken');
let fs = require("fs");
const basePath = process.env.INIT_CWD;
let PRIVATE_KEY  = fs.readFileSync(basePath+'/secret/private.key', 'utf8');

module.exports = ( req, res, next) => {
    let protected_paths = ['/','/home','/explore','/create_room','/chat','/rooms','/friends','/settings'];
    if(!protected_paths.includes(req.path)){
        next();
        return;
    }

    let access_token = req.cookies.access_token || undefined;
    if(access_token == undefined){
        if(req.path == "/"){
            res.redirect("/sign_in");
            return;
        }
        res.status(200).json({ status: 'error', message: "access_token is missing." });
        return;
    }

    jwt.verify(access_token, PRIVATE_KEY, { algorithms:'RS256' }, (error, data) => {
        if(error){
            res.status(200).json({ status:'error', error });
            return;
        }
       
        req.decoded_jwt = data;
        next();
    });
}