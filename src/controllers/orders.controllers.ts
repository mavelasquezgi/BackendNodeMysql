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

class OrderControllers {

    public async createOrder(req:Request, res: Response): Promise <Response> {
        const CONN = await connect();
        //const USERID = req.body.user;
        const PRODUCTID = parseInt(req.body.product);
        const UNITS = parseInt(req.body.units);

        let valid:boolean = true

        let USERID: any = await CONN.query('SELECT * FROM users WHERE username = ?',[req.body.user])
        console.log("id\n",USERID[0][0]['id']);
         
        const id = USERID[0][0]['id']
        try {
            validNumField(id)
        } catch (error) {
            console.error(error);
            valid = false
        }

        try {
            validNumField(PRODUCTID)
        } catch (error) {
            console.error(error);
            valid = false
        }

        try {
            validNumField(UNITS)
        } catch (error) {
            console.error(error);
            valid = false
        }

        const NEWORDER = {
            orderSt_user: id,
            orderSt_product: PRODUCTID,
            orderSt_units: UNITS,
        }
        console.log(NEWORDER);
        if (valid) {
            try {
                const USERSEARCH: any =  await CONN.query('SELECT * FROM users WHERE id = ?', [id]);
                const PRODUCTSEARCH: any =  await CONN.query('SELECT * FROM product WHERE prod_id = ?', [PRODUCTID]);
                if (USERSEARCH && PRODUCTSEARCH) {
                    const RESULTSEARCH: any = await CONN.query('INSERT INTO orderStore SET?', [NEWORDER]);
                    return res.status(200).send("Orden creada exitosamente");
                    //console.log(RESULTSEARCH[0].length) 
                } else {
                    let msj = `Error al insertar registro, no se encuentra producto con id ${PRODUCTID} o usuario con id ${USERID}`
                    return res.status(400).json(msj);
                }
        
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

    public async deleteOrder(req:Request, res:Response): Promise <Response> {
        const CONN = await connect()
        console.log(req.params.id);
        
        try {
            const RESULT: any = await CONN.query('SELECT * FROM orderStore WHERE prod_id = ?',[req.params.id]);
            //console.log(RESULT[0]);
            if (RESULT[0]) {
                const RESULTDEL: any = await CONN.query('DELETE FROM orderStore WHERE prod_id = ?',[req.params.id]);
            } 
            let msj = `eliminado producto con id ${req.params.id}`
            return res.status(200).json(msj);
        } catch (err) {
            console.log(err);
            let msj = `no se pudo eliminar producto con id ${req.params.id}`
            return res.status(400).json(msj)            
        }
    }

    public async orders(req: Request, res: Response): Promise <Response> {
        const CONN = await connect()
        try {
            const RESULT: any = await CONN.query('SELECT * FROM orderStore')
        return res.status(200).send(RESULT[0]);
        } catch (err) {
            console.log(err)
            let msj = "Error en la consulta"
            return res.status(400).json(msj);
        }
    }
}

export const orderControllers = new OrderControllers();