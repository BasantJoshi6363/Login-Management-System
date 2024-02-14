import express from "express"
import dotenv from 'dotenv'
import { connectTODB } from "./database/database.js";
import userRouter from "./src/routers/users.router.js";
dotenv.config()

let app = express()
app.use(express.json())

let port = process.env.PORT || 8000

app.use("/",userRouter)
connectTODB()

.then(()=>{
    app.listen(port,()=>{
        console.log("connected to express server");
    })
})
.catch((err)=>{
    console.log(err);
})

