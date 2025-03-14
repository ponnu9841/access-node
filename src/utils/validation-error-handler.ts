import { Response } from "express";
import Joi from "joi";

const validationErrorHandler = (response: Joi.ValidationResult<any>, res: Response) => {
    if(response.error) {
        const errorMessages = response.error.details?.map((detail) => detail.message);
        res.status(400).json({ error: errorMessages });
        return
     }
}

export default validationErrorHandler;