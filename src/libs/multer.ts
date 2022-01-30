// this file content mulrter configuration for mange image and files 

import multer from "multer";

// this impor is for string id generate
import  { v4 as uuidv4 }  from 'uuid';

// import for work with paths 
import path from 'path'

// import config for images folder
import config from '../config/config'

// this module manage upload files 
const storage = multer.diskStorage({
    // use uploads if storage in folder backend
    //destination: 'uploads',
    // use config.PATH.URLIMAGES if storage in server 
    destination: config.PATH.URLIMAGES,
    filename: (req, file, cb) => {
        // the cb funtion callback generate string id and concat with extention file
        cb(null, uuidv4() + path.extname(file.originalname))
    }
})

export default multer({storage});