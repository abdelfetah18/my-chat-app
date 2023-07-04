module.exports = ( req, res, next ) => {
    if(req.method == "POST")
        next();
    else
        res.status(405).json({ message:'method not allowed!' });
}