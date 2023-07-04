let fs = require("fs");
const basePath = process.env.INIT_CWD;
let PRIVATE_KEY  = fs.readFileSync(basePath+'/secret/private.key', 'utf8');
let jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let access_token = req.cookies.access_token || undefined; 
    if(access_token == undefined){
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