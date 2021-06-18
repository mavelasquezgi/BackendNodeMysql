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

class PetitionsControllers {
    public async actasAll (req: Request, res: Response) {
        const CONN = await connect();
        const RESULT: any = await CONN.query('SELECT * FROM acta');
        return res.status(200).json(RESULT[0]);
    }
    // todo:  pendiente 
    public async acta(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const ID = req.params
        const RESULT: any = await CONN.query('SELECT * FROM acta WHERE acta_id = {ID}');
        return res.status(200).json(RESULT[0]);
    }

    public async createActa (req: Request, res: Response) {

    }

    public async updateActa (req: Request, res: Response) {

    }


}
export const petitionsControllers = new PetitionsControllers();