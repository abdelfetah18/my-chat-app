import { updateData } from "../../../database/client"


export default function handler(req, res) {
    var { user_id,username,bio } = req.body;

    updateData(user_id,{ username,bio }).then((result) => {
        console.log('result:',result);
        res.status(200).json({ status:'success',message:'user info updated successfuly!' });
    })
}