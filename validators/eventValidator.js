import { body } from 'express-validator'



const eventValidator=[

        body('title')
            .notEmpty()
            .withMessage("Title should not be empty")
            .trim()
            .isLength({min: 4 , max: 150})
            .withMessage('Your title should not be longer then 150 characters')
            .matches(/^[a-zA-Z0-9äöüÄÖÜß\ !@#*+\-;':"\ |,.\/?]*$/)
            .withMessage("We only accept the following characters: !@#*()+\"-;':,.?"),

        body('description')
            .notEmpty()
            .withMessage("Description should not be empty")
            .isLength({max:5000})
            .withMessage('Maximum of 5000 characters')
            .matches(/^[a-zA-Z0-9äöüÄÖÜß\!@#*+\-;':"\ |,.\/?]*$/)
            .withMessage("We only accept the following special characters: !@#*()+\"-;':,.?"),

        body('start')
            .notEmpty()
            .withMessage("Event should have a start date and time"),
        body('end')
            .notEmpty()
            .withMessage("Event should have a end date and time"),

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
            .isObject()
            .withMessage('Address is required'),

        body('address.street')
            .notEmpty()
            .withMessage("Street should not be empty")
            .bail()
            .isAlphanumeric()
            .withMessage("We only accept the following special characters: !@#*()+\"-;':,.?"),

        body('address.streetNumber')
            .notEmpty()
            .withMessage("Street number should not be empty")
            .bail()
            .matches(/^[a-zA-Z0-9äöüÄÖÜß\ !@#*+\-;':"\ |,.\/?]*$/)
            .withMessage("We only accept the following special characters: !@#*()+\"-;':,.?"),
            
        body('address.zip')
            .notEmpty()
            .withMessage("Zip code should not be empty")
            .bail()
            .matches(/^[0-9]*$/)
            .withMessage('Only numbers are allowed'),

        body('address.city')
            .notEmpty()
            .withMessage("City should not be empty")
            .bail()
            .matches(/^[a-zA-Z\s]*$/)
            .withMessage('Must be a valid city'),

        body('address.country')
            .notEmpty()
            .withMessage("Country should not be empty")
            .bail()
            .matches(/^[a-zA-Z\s]*$/)
            .withMessage('Must be a valid country'),

        body('tags')
            .isArray()
            .optional({checkFalsy: true})
            .custom(value=>{ 
                const array = value
                const err= array.find(element => !element.match(/^[a-zA-Z0-9äöüÄÖÜß\ !@#*+\-;':"\ |,.\/?]*$/))
                if(err){
                    return Promise.reject("We only accept the following special characters: !@#*()+\"-;':,.?") 
                }
                return Promise.resolve()
            }),
]


export default eventValidator