let jwt = require('jsonwebtoken');
let fs = require("fs");
const path = require('path');

const basePath = process.env.INIT_CWD;
let PRIVATE_KEY  = fs.readFileSync(basePath+'/secret/private.key', 'utf8');

module.exports = (req, res, next) => {
    let protected_paths = ['/create','/delete','/edit','/invite','/join','/leave','/chat_search'];
    if(!protected_paths.includes(req.path)){
        next();
        return;
    }

    let token = req.headers.authorization || req.cookies.access_token;
    if(token == undefined){
        res.status(401).json({ status: "error", message:'Not authorized!' });
        return;
    }
    
    jwt.verify(token,PRIVATE_KEY,{ algorithms:'RS256' },(error,data) => {
        if(error){
            res.status(200).json({ status:'error', error });
            return;
        }

        req.decoded_jwt = data;
        next();
    });
}