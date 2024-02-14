import mongoose from "mongoose";

export let connectTODB= async()=>{
    try {
    await mongoose.connect("mongodb://localhost:27017/loginmanagement")   
    console.log("connected to database") 
    } catch (error) {
     console.log(error)   
    }
}