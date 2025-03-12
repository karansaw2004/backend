// require('dotenv').config({path:'./env'})

import dotenv from 'dotenv';


import connectDB from "./db/db.js";


dotenv.config({path:'./env'})


connectDB();































// const app = express();

// app.get('/',(req,res)=>{
//     res.send("karan is here");
// });

// console.log(`Connecting to database: ${process.env.MONGODB_URI}/${DB_NAME}`);

//  ;(async()=>{
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//        app.on("error",(error)=>{
//         console.log("ERROR:",error);
//        })
//        app.listen(process.env.PORT,()=>{
//             console.log(`app is listening in port ${process.env.PORT}`)
//        })
//     } catch (error) {
//         console.log("errror in connecting with data base", error)
//     }
//  })()
