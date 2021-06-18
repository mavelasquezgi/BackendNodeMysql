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
        //console.log(num)
        return num
    }
}

class AddressControllers {
    public async cities(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const RESULT: any = await CONN.query('SELECT * FROM municipio');
        return res.status(200).json(RESULT[0]);
    }

    public async departments(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const RESULT: any = await CONN.query('SELECT * FROM departamento');
        return res.status(200).json(RESULT[0]);
    }

    public async department(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const ID = req.params.idDepartment
        try {
            validNumField(ID)
        } catch (error) {
            console.error(error);
        }
        try {
            const RESULT: any = await CONN.query(`SELECT * FROM departamento WHERE departamento_id = ${ID}`);
            return res.status(200).json(RESULT[0]);
        } catch (err) {
            let msj = {
                "mjs":"El contenido de uno de los campos no es válido",
                "err": err
            }
            return res.status(400).json(msj);
        }   
    }

    public async citiesByDepartment(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const ID = req.params.idDepartment
        try {
            validNumField(ID)
        } catch (error) {
            console.error(error);
        } 
        const RESULT: any = await CONN.query(`SELECT * FROM municipio WHERE municipio_departamento_id = ${ID}`);
        return res.status(200).json(RESULT[0]);
    }

    public async allAddress(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const ID = req.params.idDepartment
        try {
            validNumField(ID)
        } catch (error) {
            console.error(error);
        }
        try {
            const RESULT: any = await CONN.query('SELECT * FROM direccion');
            return res.status(200).json(RESULT[0]);
        } catch (err) {
            let msj = {
                "mjs":"El contenido de uno de los campos no es válido",
                "err": err
            }
            return res.status(400).json(msj);
        }   
    }
    
    // ! error in insert 
    public async createDepartment(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const ID = req.body.idDepartment
        let valid = true
        try {
            validNumField(ID)
        } catch (error) {
            console.error(error);
            valid = false
        }          
        const NAME = req.body.nameDepartment
        try {
            validStrField(NAME)
        } catch (error) {
            console.error(error);
            valid = false
        }
        const RESULTSEARCH: any = await CONN.query('SELECT * FROM departamento WHERE departamento_nombre = ?', [NAME]);
        const RESULTSEARCH2: any = await CONN.query('SELECT * FROM departamento WHERE departamento_id = ?', [ID]);
        if (RESULTSEARCH[0].length != 0 || RESULTSEARCH2[0].length != 0) {
            let msj = "Ya exixte un Departament con nombre "+NAME+" o id "+ID
            return res.status(400).json(msj);
        }else {
            if (valid){
                try {
                    const newDepartment = {
                        "departamento_id": ID,
                        "departamento_nombre": NAME
                    }
                    const RESULT: any = await CONN.query('INSERT INTO departamento SET ?', [newDepartment]);
                    return res.status(201).send({ msg: 'Se creo el departamento de forma exitosa' });
                } catch (err) {
                    let msj = {
                        "mjs":"El contenido de uno de los campos no es válido",
                        "err": err
                    }
                    return res.status(400).json(msj);
                }
            } else {
                let msj = {
                    "mjs":"El contenido de uno de los campos no es válido"
                }
                return res.status(400).json(msj);
            }
                 
        }
    }

    public async createCity(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const ID = req.body.idMunicipio
        let valid = true
        try {
            validNumField(ID)
        } catch (error) {
            console.error(error);
            valid = false
        } 
        const NAME = req.body.nameMunicipio
        try {
            validStrField(NAME)
        } catch (error) {
            console.error(error);
            valid = false
        }
        const IDDEPARTMENT = req.body.idDepartment
        try {
            validNumField(IDDEPARTMENT)
        } catch (error) {
            console.error(error);
            valid = false
        }
        if (valid) {
            const RESULTSEARCH: any = await CONN.query('SELECT * FROM municipio WHERE municipio_nombre = ?', [NAME]);
            const RESULTSEARCH2: any = await CONN.query('SELECT * FROM municipio WHERE municipio_id = ?', [ID]);
            if (RESULTSEARCH[0].length != 0 || RESULTSEARCH2[0].length != 0) {
                let msj = "Ya exixte un Departament con nombre "+NAME+" o id "+ID
                return res.status(400).json(msj);
            }
            const NEWCITY = {
                'municipio_id': null,
                'municipio_codigo': ID,
                'municipio_nombre': NAME,
                'municipio_departamento_id': IDDEPARTMENT,
                'municipio_codPost': 0
            }
            try {
                const RESULT: any = await CONN.query('INSERT INTO municipio SET ?', [NEWCITY]);
                return res.status(200).send("Municipio creado exitosamente");
            } catch (err) {
                let msj = {
                    "mjs":"El contenido de uno de los campos no es válido",
                    "err": err
                }
                return res.status(400).json(msj);
            }
        } else {
            let msj = {
                "mjs":"El contenido de uno de los campos no es válido"
            }
            return res.status(400).json(msj);
        }  
    }
    
    // TODO: work in this function nor make in routes
    public async createAddress(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        let valid = true
        const ID = req.body.idMunicipio
        try {
            validNumField(ID)
        } catch (error) {
            console.error(error);
        } 
        const NEIGBOR = req.body.neighborhood  // barrio
        try {
            validStrField(NEIGBOR)
        } catch (error) {
            console.error(error);
        } 
        const DIRECTION = req.body.direction
        try {
            validStrField(DIRECTION)
        } catch (error) {
            console.error(error);
        } 
        if (valid) {
            const RESULTSEARCH: any = await CONN.query('SELECT * FROM direccion WHERE direccion_describ = ?', [DIRECTION]);
            if (RESULTSEARCH[0].length != 0 ) {
                let msj = { 'msj': "Ya exixte una direccion con nombre "+DIRECTION,
                    'id':RESULTSEARCH[0].direccion_id
                }
                return res.status(400).json(msj);
            }
            const RESULTSEARCH2: any = await CONN.query(`SELECT * FROM municipio WHERE municipio_id = ${ID}`);
            if (RESULTSEARCH2[0].length == 0 ) {
                let msj = { 'msj': "No hay un municipio con id "+ID,
                    'id':RESULTSEARCH[0].direccion_id
                }
                return res.status(400).json(msj);
            }
            try {
                const newDirection = {
                    direccion_id: null,
                    direccion_mun_id: ID,
                    direccion_barrio: NEIGBOR,
                    direccion_describ: DIRECTION
                }
                const RESULT = await CONN.query('INSERT INTO direccion SET ?', [newDirection]);
                return res.status(201).send({ msg: 'Dirección creada exitosamente' });
            } catch (err) {
                let msj = {
                    "mjs":"El contenido de uno de los campos no es válido",
                    "err": err
                }
                return res.status(400).json(msj);
            }
        } else {
            let msj = {
                "mjs":"El contenido de uno de los campos no es válido"
            }
            return res.status(400).json(msj);
        }
    }

}

export const addressControllers = new AddressControllers();