const asynchandler = (handlefunction)=>{
    return(req,res,next)=> {
       Promise.resolve(handlefunction(req,res,next)).catch((err)=>next(err))
    }
}

export {asynchandler}