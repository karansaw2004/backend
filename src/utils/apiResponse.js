class ApiResponse{
    constructor(
        statuscode,
        data,
        message= "success"
    ){
        this.statuscode = statuscode <400
        this.data = data
        this.message = message
    }
}


export {ApiResponse}