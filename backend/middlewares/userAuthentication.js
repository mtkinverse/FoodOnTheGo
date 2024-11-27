const webRouter = require('../routes/webRoutes');

const authUser = (req,res,next) => {
    const authFreeRoutes = [];
    webRouter.stack.forEach(ele => {
        if(ele.route){
            authFreeRoutes.push('/' + ele.route.path.split('/')[1]);
        }
    })
    authFreeRoutes.push('/images');
    
    if(authFreeRoutes.includes('/' + req.path.split('/')[1])) next();
    else{
        const token = req.cookies.access_token;
        if(token) next();
        else res.status(401).json({message:'Access Denied'});
    }
}

module.exports = authUser;