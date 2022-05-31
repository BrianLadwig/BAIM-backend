import { body } from 'express-validator'



const eventUpdateValidator=[

        body('title')
            .optional({checkFalsy: true})
            .trim()
            .isLength({min: 4 , max: 150})
            .withMessage('your title should not be bigger then 150 characters long')
            .matches(/^[a-zA-Z0-9äöüÄÖÜß\ !@#*+\-;':"\ |,.\/?]*$/)
            .withMessage("we only accept he following characters including whitespace: !@#*()+\"-;':,.?"),

        body('description')
            .optional({checkFalsy: true})
            .isLength({max:5000})
            .withMessage('no more then 5000 characters including whitespace')
            .matches(/^[a-zA-Z0-9äöüÄÖÜß\!@#*+\-;':"\ |,.\/?]*$/)
            .withMessage("We only accept the following special characters including whitespace: !@#*()+\"-;':,.?"),

        body('video')
            .optional({checkFalsy: true})
            .trim()
            .isURL({protocols:['http','https']}),

        body('image')
            .optional({checkFalsy: true})
            .trim()
            .isURL({protocols:['http','https']}),

        body('link')
            .optional({checkFalsy: true})
            .trim()
            .isURL({protocols:['http','https']}),
        
        body('address')
            .optional({checkFalsy: true})
            .isArray()
            .withMessage('address is required '),

        body('address.*.street')
            .optional({checkFalsy: true})
            .matches(/^[a-zA-Z0-9äöüÄÖÜß\ !@#*+\-;':"\ |,.\/?]*$/)
            .withMessage("We only accept the following special characters including whitespace: !@#*()+\"-;':,.?"),
            
        body('address.*.zip')
            .optional({checkFalsy: true})
            .matches(/^[0-9]*$/)
            .withMessage('Only numbers are allowed'),

        body('address.*.city')
            .optional({checkFalsy: true})
            .matches(/^[a-zA-Z\s]*$/)
            .withMessage('only alphabetic characters and white space'),

        body('address.*.country')
            .optional({checkFalsy: true})
            .matches(/^[a-zA-Z\s]*$/)
            .withMessage('only alphabetic characters and white space'),


        body('tags')
            .optional({checkFalsy: true})
            .isArray()
            .custom(value=>{ 
                const array = value
                const err= array.find(element => !element.match(/^[a-zA-Z0-9äöüÄÖÜß\ !@#*+\-;':"\ |,.\/?]*$/))
                if(err){
                    return Promise.reject("We only accept the following special characters including whitespace: !@#*()+\"-;':,.?") 
                }
                return Promise.resolve()
            }),
            
        body('author')
            .optional({checkFalsy: true})
            .trim()
            .notEmpty()
            .withMessage('Author is required')


]


export default eventUpdateValidator