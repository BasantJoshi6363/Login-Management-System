import jwt from "jsonwebtoken";

export let isAuthenticated = async(req,res,next)=>{
    try {
        //get token from postman
        let tokenStr = req.headers.authorization
        let token = tokenStr.split(" ")[1]

        //verify the token

        let tokenVerify = await jwt.verify(token,process.env.SECRET_KEY)
        req._id = tokenVerify._id
        // console.log(user_id)
        next()
      
    } catch (error) {
        
    }
}