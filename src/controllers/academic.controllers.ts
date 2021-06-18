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

class AcademicControllers {
    public async createFaculty(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const NAME = req.body.nameFacultad
        let valid:boolean = true
        try {
            validStrField(NAME)
        } catch (error) {
            console.error(error);
            valid = false
        }
        const NEWFACULTAD = {
            facultad_id: null,
            facultad_nombre: NAME
        }
        if (valid) {
            const RESULTSEARCH: any = await CONN.query('SELECT * FROM facultad WHERE facultad_nombre = ?', [NAME]);
            console.log(RESULTSEARCH[0].length)
            if (RESULTSEARCH[0].length != 0) {
                let msj = "Ya exixte la facultad "+NAME
                return res.status(400).json(msj);
            }else {
                try {
                    const RESULT: any = await CONN.query('INSERT INTO facultad SET ?', [NEWFACULTAD]);
                    return res.status(200).send("Facultad ("+NAME+") creada exitosamente"); 
                } catch (err) {
                    let msj = {
                        "error": err
                    }
                    return res.status(400).json(msj);
                }     
            }
        } else {
            let msj = "El contenido de uno de los campos no es válido"
            return res.status(400).json(msj);
        } 
    }

    public async faculties(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const RESULT: any = await CONN.query('SELECT * FROM facultad');
        return res.status(200).json(RESULT[0]);
    }

    public async programs(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const RESULT: any = await CONN.query('SELECT * FROM programa');
        return res.status(200).json(RESULT[0]);
    }

    public async headquarters(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const RESULT: any = await CONN.query('SELECT * FROM sede');
        return res.status(200).json(RESULT[0]);
    }

    public async programsByHeadquarters(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const ID = req.params.idHeadquarter
        const RESULT: any = await CONN.query(`SELECT * FROM programa_sede WHERE prograSede_sed_id = ${ID}`);
        return res.status(200).json(RESULT[0]);
    }

    public async facultiesByHeadquarters(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const ID = req.params.idHeadquarter
        try {
            const RESULT: any = await CONN.query(`SELECT * FROM facultad_sede WHERE facultadSede_sed_id = ${ID}`);
            return res.status(200).json(RESULT[0]);
        } catch (err) {
            let msj = {
                "error": err
            }
            return res.status(400).json(msj);
        }
    }

    public async programsByFaculties(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const ID = req.params.idFaculty
        const IDHEAD = req.params.idHeadquarter
        let valid = true
        try {
            validNumField(IDHEAD)
        } catch (error) {
            console.error(error);
            valid = false
        }
        try {
            validNumField(ID)
        } catch (error) {
            console.error(error);
            valid = false
        }
        if (valid) {
            try {
                const RESULT: any = await CONN.query(`SELECT DISTINCT programa.programa_id, programa.programa_nivelAcademico, programa.programa_descripcion, programa.programa_nombre   FROM programa INNER JOIN programa_facultad ON programa.programa_id = programa_facultad.prograFacult_prog_id INNER JOIN facultad_sede ON programa_facultad.prograFacult_id = facultad_sede.facultadSede_facul_id WHERE programa_facultad.prograFacult_facult_id = ${ID} AND facultad_sede.facultadSede_sed_id = ${IDHEAD} `);
                return res.status(200).json(RESULT[0]);
            } catch (err) {
                let msj = {
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

export const academicControllers = new AcademicControllers();

