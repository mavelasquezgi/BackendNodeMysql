import { Request, response, Response } from 'express';
import { connect } from '../database';
import path from 'path';
// intall with <npm i fs-extra> <npm i @types/fs-extra -D>
import fs from 'fs-extra'
import {addPDF} from '../helpers/reports'

function validStrField (field: string) {
    let errors: string[] = ["find","select","drop","update","href","delete"]
    for (let err in errors) {
        let conten = field.toLowerCase().indexOf(errors[err])
        if (conten != -1) {
            //console.log("valid", err)
            throw "Valor no válido"+err
        }
    }
    return field
}

function validNumField (num:any) {
    if (isNaN(num)) {
      throw num+" (No es un numero)";
    } else {
        return num
    }
}

class ProductControllers {
    public async createProduct(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const NAME = req.body.name
        const DESCRIP = req.body.descrip
        const CATEGORY = parseInt(req.body.category)
        const PRICE = req.body.price
        const WHEIGTH = parseFloat(req.body.wheigth)
        const IMAGE = req.file?.path
        console.log(IMAGE);
        

        let valid:boolean = true
        try {
            validStrField(NAME)
        } catch (error) {
            console.error(error);
            valid = false
        }
        try {
            validNumField(CATEGORY)
        } catch (error) {
            console.error(error);
            valid = false
        }
        const NEWPRODUCT = {
            prod_name: NAME,
            prod_descrip: DESCRIP,
            prod_category: CATEGORY,
            prod_price: PRICE,
            prod_wheigth: WHEIGTH,
            prod_image: IMAGE?.replace('/home/mauro/Documents/git/FrontentAngularMysql/src/',""),
        }
        console.log(NEWPRODUCT);
        
        if (valid) {
            try {
                const RESULTSEARCH: any = await CONN.query('INSERT INTO product SET?', [NEWPRODUCT]);
                //console.log(RESULTSEARCH[0].length)
                return res.status(200).send("Producto ("+NAME+") creado exitosamente"); 
            } catch (err) {
                console.log(err)
                let msj = "Error al insertar registro"
                return res.status(400).json(msj);
            }
            
        } else {
            let msj = "El contenido de uno de los campos no es válido"
            return res.status(400).json(msj);
        } 
    }

    public async updateProduct(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const NAME = req.body.name
        const DESCRIP = req.body.descrip
        const CATEGORY = parseInt(req.body.category)
        const PRICE = req.body.price
        const WHEIGTH = parseInt(req.body.wheigth) 
        //const IMAGE = req.file?.path      

        console.log("input body\n",req.body)

        let valid:boolean = true
        try {
            validStrField(NAME)
        } catch (error) {
            console.error(error);
            valid = false
        }
        try {
            validNumField(CATEGORY)
        } catch (error) {
            console.error(error);
            valid = false
        }
        const NEWPRODUCT = {
            prod_name: NAME,
            prod_descrip: DESCRIP,
            prod_category: CATEGORY,
            prod_price: PRICE,
            prod_wheigth: WHEIGTH,
            //prod_image: IMAGE
        }
        if (valid) {
            try {
                const RESULTSEARCH: any = await CONN.query(`UPDATE product set ? WHERE prod_id = ${req.body.id}`, [NEWPRODUCT]);
                console.log(RESULTSEARCH[0].length)
                return res.status(200).send("Producto ("+NAME+") actualizado exitosamente"); 
            } catch (err) {
                console.log(err)
                let msj = "Error al actualizar registro"
                return res.status(400).json(msj);
            }
            
        } else {
            let msj = "El contenido de uno de los campos no es válido"
            return res.status(400).json(msj);
        } 
    }

    public async allproducts(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();

        try {
            const RESULTSEARCH: any = await CONN.query('SELECT * FROM product');
            console.log(RESULTSEARCH[0].length)
            return res.status(200).send(RESULTSEARCH[0]); 
        } catch (err) {
            console.log(err)
            let msj = "Error en la consulta"
            return res.status(400).json(msj);
        }        
    }

    public async getproduct(req: Request, res: Response): Promise <Response> {
        const CONN = await connect()
        try {
            const RESUTL: any = await CONN.query('SELECT * FROM product WHERE prod_id = ?',[req.params.id])
            return res.status(200).send(RESUTL[0][0]);
        } catch (err) {
            console.log(err)
            let msj = "Error en la consulta"
            return res.status(400).json(msj);
        }
        
    }

    public async delproduct(req: Request, res: Response): Promise <Response> {
        const CONN = await connect()
        console.log(req.params.id);
        
        try {
            const RESULT: any = await CONN.query('SELECT * FROM product WHERE prod_id = ?',[req.params.id])
            //console.log(RESULT[0]);
            if (RESULT[0]) {
                //console.log(RESULT[0][0].prod_image);
                await fs.unlink(path.resolve(RESULT[0][0].prod_image)?.replace('BackendNodeMysql',"FrontentAngularMysql/src"))
                const RESULTDEL: any = await CONN.query('DELETE FROM product WHERE prod_id = ?',[req.params.id])
            } 
            let msj = `eliminado producto con id ${req.params.id}`
            return res.status(200).json(msj);
        } catch (err) {
            console.log(err);
            let msj = `no se pudo eliminar producto con id ${req.params.id}`
            return res.status(400).json(msj)            
        }
    }

    public async createPdf(req: Request, res: Response): Promise <Response> {
       
        const CONN = await connect();

        try {
            const RESULTSEARCH: any = await CONN.query('SELECT * FROM product');
            console.log(RESULTSEARCH[0].length);
            addPDF(RESULTSEARCH[0]);
            return res.status(200).send(RESULTSEARCH[0]); 
        } catch (err) {
            console.log(err)
            let msj = "Error en la consulta"
            return res.status(400).json(msj);
        }   
    }
}



export const productControllers = new ProductControllers();