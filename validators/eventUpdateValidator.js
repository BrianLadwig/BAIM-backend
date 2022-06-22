import { body } from 'express-validator'



const eventUpdateValidator=[

        body('title')
            .optional({checkFalsy: true})
            .trim()
            .isLength({min: 4 , max: 150})
            .withMessage('Your title should not be longer then 150 characters')
            .matches(/^[a-zA-Z0-9äöüÄÖÜß\ !@#*+\-;':"\ |,.\/?]*$/)
            .withMessage("We only accept the following characters: !@#*()+\"-;':,.?"),

        body('description')
            .optional({checkFalsy: true})
            .isLength({max:5000})
            .withMessage('Maximum of 5000 characters')
            .matches(/^[a-zA-Z0-9äöüÄÖÜß\!@#*+\-;':"\ |,.\/?]*$/)
            .withMessage("We only accept the following special characters: !@#*()+\"-;':,.?"),

        body('startDate')
            .optional({checkFalsy: true})
            .notEmpty()
            .withMessage("Event should have a start date"),
        body('startTime')
            .optional({checkFalsy: true})
            .notEmpty()
            .withMessage("Event should have a start time"),
        body('endDate')
            .optional({checkFalsy: true})
            .notEmpty()
            .withMessage("Event should have a end date"),
        body('endTime')
            .optional({checkFalsy: true})
            .notEmpty()
            .withMessage("Event should have a end time"),

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
            .optional({checkFalsy: true}),

        body('address.street')
            .optional({checkFalsy: true})
            .isAlphanumeric()
            .withMessage("We only accept the following special characters: !@#*()+\"-;':,.?"),

        body('address.streetNumber')
            .optional({checkFalsy: true})
            .matches(/^[a-zA-Z0-9äöüÄÖÜß\ !@#*+\-;':"\ |,.\/?]*$/)
            .withMessage("We only accept the following special characters: !@#*()+\"-;':,.?"),
            
        body('address.zip')
            .optional({checkFalsy: true})
            .matches(/^[0-9]*$/)
            .withMessage('Only numbers are allowed'),

        body('address.city')
            .optional({checkFalsy: true})
            .matches(/^[a-zA-Z\s]*$/)
            .withMessage('Must be a valid city'),

        body('address.country')
            .optional({checkFalsy: true})
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


export default eventUpdateValidator