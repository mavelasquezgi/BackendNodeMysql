// this file content mulrter configuration for mange image and files 

import multer from "multer";
import { callbackPromise } from "nodemailer/lib/shared";

// this module manage upload files 
multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, callback) => {
        callback()
    }
})