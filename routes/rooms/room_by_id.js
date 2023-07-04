const { getRoom } = require("../../database/client");
let fs = require("fs");
const basePath = process.env.INIT_CWD;
let PRIVATE_KEY  = fs.readFileSync(basePath+'/secret/private.key', 'utf8');
let jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if(req.cookies.access_token == undefined){
        res.status(200).json({ status: 'error', message: "access_token is missing." });
        return;
    }

    jwt.verify(req.cookies.access_token, PRIVATE_KEY,{ algorithms:'RS256' },(error, data) => {
        if(error){
            res.status(200).json({ status:'error', error });
            return;
        }
        req.decoded_jwt = data;
    
        // TODO: Prevent unauthorized access to the room like when the user is not a member.
        getRoom(req.params.room_id).then((room) => {
            if(room){
                next();
                return;
            }
            
            res.status(200).json({ status:'error', message:"You are not a member!" });
        }).catch((error) => {
            res.status(200).json({ status:'error', error });
        })
    });
}