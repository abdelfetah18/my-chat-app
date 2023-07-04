const { getRoom, uploadCover } = require("../../../database/client");

module.exports = async ( req, res) => {
    let { room_id } = req.body;

    try{
        let file_path = './'+req.file.path;
        let asset = await uploadCover(file_path, room_id);
        res.setHeader('Access-Control-Allow-Origin','*');
        let room = await getRoom(room_id);
        res.status(200).json({ status:'success', message:'Uploaded successfuly!', data: room });
    }catch(error){
        console.log({error})
        res.status(200).json({ status: "error", error, message: "Something went wrong!" });
    }
}