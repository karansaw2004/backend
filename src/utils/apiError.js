class apiError extends Error{
    constructor(
        statuscode,
        message=  "something went wrong",
        errors = [],
        statack = "",
    ){
        super(message)
        this.statuscode = statuscode
        this.errors = errors 
        this.data = null

        if(statack){
            this.statck = statack
        }else{
            Error.captureStackTrace(this,this.constructor) 
        }

    }
}


export {apiError}; 