import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/users.models.js";
//backend
//data -> username , email, password

export let generateUser = async (req, res) => {
  let { username, email, password, isVerifiedEmail } = req.body;
  try {
    let user = await User.findOne({ email: email });

    //hash password
    let hashPassword = await bcrypt.hash(password, 10);

    let result = await User.create({
      username,
      email,
      password: hashPassword,
      isVerifiedEmail: false,
    });
    res.status(200).json({
      succss: true,
      message: "user created successfully",
      result: { username, email, password, isVerifiedEmail },
    });
  } catch (error) {
    res.status(401).json({
      success: true,
      message: error.message,
    });
  }
};

export let verifyEmail = async (req, res) => {
  //get the token from header.authorization
  try {
    let tokenStr = req.headers.authorization;
    //token comes with word bearer so i split it and extract the token only
    let token = tokenStr.split(" ")[1];
    //if we verify the token it will provide an object which contain userId and use udpate the info by simply by id and update
    let confirmTOken = await jwt.verify(token, process.env.SECRET_KEY);
    let userId = confirmTOken._id;
    let result = await User.findByIdAndUpdate(
      userId,
      {
        isVerifiedEmail: true,
      },
      { new: true }
    );
    res.status(200).json({
      succss: true,
      message: "user verified successfully",
      result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export let loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email && password) {
      let error = new Error("credentials not found.");
      throw error;
    }
    let user = await User.findOne({ email: email });
    if (!user.email) {
      let error = new Error("credentials not found.");
      throw error;
    }
    if (!user.isVerifiedEmail) {
      let error = new Error("email is not verified yet.");
      throw error;
    }
    //compare the password with bcrypt library
    let checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      let error = new Error("credentials not found.");
      throw error;
    }
    //if password is correct let's generate the token and give it to the frontend
    let info = {
      _id: user._id,
    };
    let secretKey = process.env.SECRET_KEY;

    let expiresIn = {
      expiresIn: "30d",
    };

    let generateToken = await jwt.sign(info, secretKey, expiresIn);
    
    res.status(200).json({
      succss: true,
      message: "user login successfully",
      generateToken,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export let myProfile = async (req, res, next) => {
  try {
    //getting id from middlwware is authenticated
    let user_id = req._id;
    let user = await User.findById(user_id);
    res.status(200).json({
      success: true,
      message: "my profile page",
      user,
    });
  } catch (error) {
    res.status(404).json({
      success: true,
      message: error.message,
    });
  }
};

export let updateProfile = async (req, res, next) => {
  let data = req.body;
  try {
    //getting id from middlwware is authenticated
    let user_id = req._id;
    let user = await User.findByIdAndUpdate(user_id, { data }, { new: true });
    delete data.email;
    delete data.password;

    res.status(200).json({
      success: true,
      message: "Data updated Successfully.",
      user,
    });
  } catch (error) {
    res.status(404).json({
      success: true,
      message: error.message,
    });
  }
};

export let changePassword = async (req, res, next) => {
  try {
    let oldPassword = req.body.oldPassword;
    let user_id = req._id;
    let newPassword = req.body.newPassword;
    let findUser = await User.findById(user_id);

    //check old password is wrong or not
    let checkOldPassword = await bcrypt.compare(oldPassword, findUser.password);
    if (!checkOldPassword) {
      let err = new Error("credentials doesnot match");
      throw error;
    }
    //hash the new password and update to the database
    let hashNewPassword = await bcrypt.hash(newPassword, 10);
    //update it to the database
    findUser.password = hashNewPassword;
    findUser.save();
    res.status(200).json({
      success: true,
      messgae: "Updated new password successfully",
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export let readAllUser  = async(req,res)=>{
    try {
        let data = req.body
        let result = await User.find({})
        res.status(200).json({
            success : false,
            message : "read user successfully.",
            result
        })

    } catch (error) {
        res.status(400).json({
            success : false,
            message : error.message,
            
        })
    }
}

export let readSpecificUser = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await User.findById(id);
    res.status(200).json({
      success: false,
      message: "user find successfully.",
      result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let updateSpecificUser = async (req, res) => {
  try {
    let id = req.params.id;
    let data = req.body;
    delete data.email
    delete data.password
    let result = await User.findByIdAndUpdate(id,data,{new:true})
    delete result.email
    delete result.password
    res.status(200).json({
        success : true,
        message : "user updated successfully",
        result

    })
  } catch (error) {
    res.status(400).json({
        success : false,
        message : error.message
    })
  }
};

export let deleteSpecificUser = async(req,res)=>{
    try {
        let id = req.params.id;
        let result = await User.findByIdAndDelete(id);
        res.status(200).json({
          success: false,
          message: "user deleted successfully.",
          result
        });
        
    } catch (error) {
        res.status(400).json({
            success : false,
            message : error.message
        })
    }
}

export let resetPasswordOrForgotPassword = async(req,res)=>{
    try {
      const email = req.body.email
      const user = await User.findOne({email})
      if(!user){
        const Err = new Error("Email doesn't match")
        throw Err
      }
      const info={
        _id : user._id
      }
      const expiresIn ={
        expiresIn : "10d"
      }
      //send token to email
      const token = await jwt.sign(info,process.env.SECRET_KEY,expiresIn)
      delete user.email
      delete user.password
      await sendMail({
        from: "basantjoshi6363@gmail.com",
        to: user.email,
        subject: "confirm your email account account",
        html: `
                  <h1> click here to verify your account </h1>
                  <a href="https://localhost:8000/api/verify-email?token=${token}">https://localhost:8000/api/verify-email?token=${token}</a>
              `,
      });
      res.json({
        success : true,
        message : "verification info sended to your email",
        user
      })

    } catch (error) {
      res.status(400).json({
        success : false,
        message : error.message
      })
    }
}

export const updatePassword = async(req,res)=>{
  try {
    const tokenStr = req.headers.authorization
    const token = tokenStr.split(" ")[1]

    //check the token,

    const checkValidToken = await jwt.verify(token,process.env.SECRET_KEY)
    if(!checkValidToken){
      const err = new Error("your token is not valid")
      throw err
    }
    //enter password and confirm password
    const newPassword = req.body.newPassword
    const confirmPassword = req.body.confirmPassword
    if(!newPassword===confirmPassword){
      const err = new Error("your password doesnot match.")
      throw err
    }
    //let hash the password

    let hashPassword = await bcrypt.hash(newPassword,10);
    let user_id = req._id
    //find the id to update the password
    const user = await User.findOne({user_id})
    user.password = hashPassword;
    res.status(200).json({
      success : true,
      "message" : "password updateded successfully."
    })

  } catch (error) {
    res.json({
      success : false,
      message : error.message
    })
  }

}
