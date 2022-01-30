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

class CategoryControllers {
    public async createCategory(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const NAME = req.body.name
        const DESCRIP = req.body.descrip

        let valid:boolean = true
        try {
            validStrField(NAME)
        } catch (error) {
            console.error(error);
            valid = false
        }
        const NEWCATEGORY = {
            cat_name: NAME,
            cat_descrip: DESCRIP,
        }
        if (valid) {
            try {
                const RESULTSEARCH: any = await CONN.query('INSERT INTO category SET?', [NEWCATEGORY]);
                console.log(RESULTSEARCH[0].length)
                return res.status(200).send("Categoría ("+NAME+") creada exitosamente"); 
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

    public async updateCategory(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const NAME = req.body.name
        const DESCRIP = req.body.descrip

        let valid:boolean = true
        try {
            validStrField(NAME)
        } catch (error) {
            console.error(error);
            valid = false
        }
        const NEWCATEGORY = {
            cat_name: NAME,
            cat_descrip: DESCRIP,
        }
        if (valid) {
            try {
                const RESULTSEARCH: any = await CONN.query('UPDATE category SET ? WHERE cat_id = ?', [NEWCATEGORY,req.body.id]);
                console.log(RESULTSEARCH[0].length)
                return res.status(200).send("Categoría ("+NAME+") actualizada exitosamente"); 
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

    public async categories(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();

        try {
            const RESULTSEARCH: any = await CONN.query('SELECT * FROM category');
            console.log(RESULTSEARCH[0].length)
            return res.status(200).send(RESULTSEARCH[0]); 
        } catch (err) {
            console.log(err)
            let msj = "Error en la consulta"
            return res.status(400).json(msj);
        }
    }

    public async category(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const NAME = req.params.name
        let valid:boolean = true
        try {
            validStrField(NAME)
        } catch (error) {
            console.error(error);
            valid = false
        }
        if (valid) {
            try {
                const RESULTSEARCH: any = await CONN.query('SELECT * FROM category WHERE cat_name = ?',[NAME]);
                console.log(RESULTSEARCH[0].length)
                return res.status(200).send(RESULTSEARCH[0]); 
            } catch (err) {
                console.log(err)
                let msj = "Error en la consulta"
                return res.status(400).json(msj);
            }
        } else {
            let msj = "El contenido de uno de los campos no es válido"
            return res.status(400).json(msj);
        }
    }
}


export const categoryControllers = new CategoryControllers();