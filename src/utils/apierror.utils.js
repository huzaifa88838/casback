class apierror extends Error{
    constructor(
        statuscode,
        message = "something went wrong",
        stack = "",
        errors = {}
    ){
super(message)
this.statuscode = statuscode
this.message = message
this.errors = errors
this.success = false,
this.data = null
if (stack) {
    this.stack = stack
}else{
    Error.captureStackTrace(this,this.constructor)
}
    }
}
export{apierror}