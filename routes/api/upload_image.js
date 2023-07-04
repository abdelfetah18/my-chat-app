const { uploadImage } = require("../../database/client");

module.exports = async ( req, res) => {
    let { user_id } = req.body;
    try{
        let file_path = './'+req.file.path;
        let asset = await uploadImage(file_path, user_id);
        res.setHeader('Access-Control-Allow-Origin','*');
        res.status(200).json({ status:'success', message:'Uploaded successfuly!', ...asset });
    }catch(error){
        console.log({ error })
        res.status(200).json({ status: "error", error, message: "Something went wrong!" });
    }
}