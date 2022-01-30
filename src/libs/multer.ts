// this file content mulrter configuration for mange image and files 

import multer from "multer";

// this impor is for string id generate
import  { v4 as uuidv4 }  from 'uuid';

// import for work with paths 
import path from 'path'
// this module manage upload files 
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        // the cb funtion callback generate string id and concat with extention file
        cb(null, uuidv4() + path.extname(file.originalname))
    }
})

export default multer({storage});