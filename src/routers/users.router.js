import { Router } from "express";
import { changePassword, deleteSpecificUser, generateUser, loginUser, myProfile, readAllUser, readSpecificUser, resetPasswordOrForgotPassword, updatePassword, updateProfile, updateSpecificUser, verifyEmail } from "../controllers/users.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";


let userRouter = Router()

userRouter.route("/api/createusers").post(generateUser)
userRouter.route("/api/verify-email").patch(verifyEmail)
userRouter.route("/api/login").post(loginUser)
userRouter.route("/api/my-profile").get(isAuthenticated,myProfile)
userRouter.route("/api/update-profile").patch(isAuthenticated,updateProfile)
userRouter.route("/api/change-password").patch(isAuthenticated,changePassword)
userRouter.route("/api/alluser").get(readAllUser)
userRouter.route("/api/reset-password").post(resetPasswordOrForgotPassword)
userRouter.route("/api/update-password").patch(updatePassword)

userRouter.route("/api/update/:id").patch(updateSpecificUser)
userRouter.route("/api/:id").get(readSpecificUser)
userRouter.route("/api/delete/:id").delete(deleteSpecificUser)









export default userRouter