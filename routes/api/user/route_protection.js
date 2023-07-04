let jwt = require('jsonwebtoken');
let fs = require("fs");

const basePath = process.env.INIT_CWD;
let PRIVATE_KEY  = fs.readFileSync(basePath+'/secret/private.key', 'utf8');

module.exports = (req, res, next) => {
    if(req.cookies.access_token == undefined && req.headers.authorization){
        res.status(200).json({ status: "error", message: "Not authorized" });
        return;
    }

    jwt.verify(req.cookies.access_token, PRIVATE_KEY,{ algorithms:'RS256' },(error, data) => {
        if(error){
            res.status(200).json({ status: 'error', error });
            return;
        }
        
        req.decoded_jwt = data;
        next();
    });
}