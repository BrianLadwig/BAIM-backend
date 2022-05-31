import { body } from 'express-validator'



const eventValidator=[

        body('title')
            .trim()
            .isLength({min: 4 , max: 150})
            .withMessage('your title should not be bigger then 150 characters long')
            .matches(/^[a-zA-Z0-9äöüÄÖÜß\ !@#*+\-;':"\ |,.\/?]*$/)
            .withMessage("we only accept he following characters including whitespace: !@#*()+\"-;':,.?"),

        body('description')
            .isLength({max:5000})
            .withMessage('no more then 5000 characters including whitespace')
            .matches(/^[a-zA-Z0-9äöüÄÖÜß\!@#*+\-;':"\ |,.\/?]*$/)
            .withMessage("We only accept the following special characters including whitespace: !@#*()+\"-;':,.?"),

        body('video')
            .trim()
            .optional({checkFalsy: true})
            .isURL({protocols:['http','https']}),

        body('image')
            .trim()
            .optional({checkFalsy: true})
            .isURL({protocols:['http','https']}),

        body('link')
            .trim()
            .optional({checkFalsy: true})
            .isURL({protocols:['http','https']}),
        
        body('address')
            .exist()
            .widthMessage('address is required '),

        body('address.*.street')
            .matches(/^[a-zA-Z0-9äöüÄÖÜß\ !@#*+\-;':"\ |,.\/?]*$/)
            .withMessage("We only accept the following special characters including whitespace: !@#*()+\"-;':,.?"),
            
        body('address.*.zip')
        .matches(/^[0-9]*$/)
        .withMessage('Only numbers are allowed'),

        body('address.*.city')
        .matches(/^[a-zA-Z\s]*$/)
        .withMessage('only alphabetic characters and white space'),

        body('address.*.country')
        .matches(/^[a-zA-Z\s]*$/)
        .withMessage('only alphabetic characters and white space'),


        body('tags')
            .isArray()
            .optional({checkFalsy: true})
            .custom(value=>{ 
                const array = value
                const err= array.find(element => !element.match(/^[a-zA-Z0-9äöüÄÖÜß\ !@#*+\-;':"\ |,.\/?]*$/))
                if(err){
                    return Promise.reject("We only accept the following special characters including whitespace: !@#*()+\"-;':,.?") 
                }
                return Promise.resolve()
            }),
            
        body('author')
            .trim()
            .notEmpty()
            .withMessage('Author is required')


]


export default eventValidator