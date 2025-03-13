const asyncHandeler =(requestHandeler)=>{
    (req,res)=>{
        Promise.resolve(requestHandeler(req,res,next)).catch((err)=>next(err))
    }
}


export {asyncHandeler}; 

// const acyncHandeler = (fu)=> async (req,res,next) =>{
//     try {
        
//     } catch (error) {
//         res.status(err.code|| 500).json({
//             sucess: false,
//             message: err.message,
//         })
//     }
// };
