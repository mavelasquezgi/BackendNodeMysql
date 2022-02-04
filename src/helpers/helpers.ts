import bcrypt from 'bcrypt'
// use pdfmake <npm i pdfmake --save>
const PdfPrinter = require('pdfmake')
const fs = require('fs')


export const encryptPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

export const matchPassword = async (password: string, savedPassword: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (e) {
        console.log(e);
        return false;
    }
};




