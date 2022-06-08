import { validationResult } from "express-validator";



 function requestValidator(projectValidator){

    const middleware =[...projectValidator]

    middleware.push((req,res,next)=>{

        const errors = validationResult(req)

        if(errors.isEmpty()){
            return next()
        }

        const organizedErrors = errors.array().map(error=>{
            console.log("requestValidator errors:", error)
            return { [ error.param]: error.msg}
        })

        res.status(400).send({errors: organizedErrors})
    })

    return middleware
}

export default requestValidator