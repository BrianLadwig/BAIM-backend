import jwt from 'jsonwebtoken'
import User from '../models/User.js';

// to check if the user have access === login
async function checkLogin(req, res, next) {
//    console.log('req.cookies :>> ', req.cookies);
    if(!req.cookies.token){    
        next({ status: 401, errors: "You need to log in first"})
    }
   
    try {
        const checkToken = jwt.verify(req.cookies.token, process.env.SECRET)
        const user = await User.findById(checkToken.id)
        if(!user){
            next({ status: 401, errors: "User does not exist"})
            return
        }
        req.user = user
        next()
    } catch (error) {
        console.log('error.message :>> ', error.message);
        next({ status: 400, errors: error })
    }
}

// endpoint for logout ---> token = ""

export default checkLogin