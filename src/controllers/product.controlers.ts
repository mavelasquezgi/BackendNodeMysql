import { Request, Response } from 'express';
import { connect } from '../database';

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
        const NAME = req.body.prod_name
        const DESCRIP = req.body.prod_descrip
        const CATEGORY = req.body.prod_category
        const PRICE = req.body.prod_price
        const WHEIGTH = req.body.prod_wheigth
        const IMAGE = req.body.prod_wheigth

        let valid:boolean = true
        try {
            validStrField(NAME)
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
            prod_image: IMAGE,
        }
        if (valid) {
            try {
                const RESULTSEARCH: any = await CONN.query('INSERT INTO product(prod_name,prod_descrip,prod_category,prod_price,prod_wheigth,prod_image) values =?', [NEWPRODUCT]);
                console.log(RESULTSEARCH[0].length)
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
}


export const productControllers = new ProductControllers();