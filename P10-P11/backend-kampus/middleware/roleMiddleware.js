function onlyDosen(req,res,next){
    if(req.user.role !== 'dosen'){
        return res.status(403).json({message:"Akses Ditolak!"});
    }
    next();
}

module.exports = { onlyDosen };