import { Request, Response } from 'express';
import { connect } from '../database';
import { encryptPassword, matchPassword } from '../helpers/helpers';
import { createToken } from '../helpers/jwt_helpers';

class UserController {

    public async users(req: Request, res: Response): Promise<Response> {
        const CONN = await connect();
        const RESULT: any = await CONN.query('SELECT * FROM users');
        return res.status(200).json(RESULT[0]);
    }

    public async signup(req: Request, res: Response): Promise<Response> {
        const { fullname } = req.body;
        const { email } = req.body;
        const { password } = req.body;
        const { username } = req.body;
        const verification = true;
        const role = req.body.role;
        const password2 = req.body.password2;
        if (password2 == password) {
            const newUser = {
                username,
                password,
                fullname,
                email,
                verification,
                role
            }
            newUser.password = await encryptPassword(password);
            const CONN = await connect();
            try {
                const RESULT = await CONN.query('INSERT INTO users SET ?', [newUser]);
                return res.status(201).send({ msg: 'Usuario Creado exitosamente' });
            } catch (e) {
                console.log(e);
                return res.status(400).send({ msg: 'Usuario o email ya existen' });
            }
        } else {
            return res.status(400).send({ msg: 'Las contraseñas no coinciden' });
        }
    }

    public async signin(req: Request, res: Response): Promise<Response> {
        if (!req.body.username || !req.body.password) {
            return res.status(400).send({ msg: 'Usuario y contraseña son requeridos' });
        } else {
            const CONN = await connect();
            const RESULT: any = await CONN.query('SELECT * FROM users WHERE username = ?', [req.body.username]);
            if (RESULT[0].length > 0) {
                const USERString = JSON.stringify(RESULT[0]);
                const USER = JSON.parse(USERString)[0];
                const isMatch = await matchPassword(req.body.password, USER.password);
                if (isMatch) {
                    if (USER.verification) {
                        const expiresIn = 48 * 60 * 60;
                        const accessToken = await createToken(USER.id, expiresIn);
                        const userResponse = {
                            id: USER._id,
                            fullname: USER.fullname,
                            username: USER.username,
                            role: USER.role,
                            email: USER.email,
                            token: accessToken,
                            expiresIn: expiresIn
                        }
                        return res.status(200).json(userResponse);
                    } else {
                        return res.status(401).json({ msg: 'Usuario no verificado' });
                    }
                } else {
                    return res.status(401).send({ msg: 'Contraseña incorrecta' });
                }
            } else {
                return res.status(401).send({ msg: 'El usuario no existe' });
            }
        }

    }

    public async changePassword(req: Request, res: Response): Promise<Response> {
        const { currentPassword, newPassword } = req.body;
        let request: any = req.user;
        if (request) {
            const validPassword = await matchPassword(currentPassword, request.password);
            if (validPassword) {
                var passE = await encryptPassword(newPassword);
                const CONN = await connect();
                try {
                    await CONN.query('UPDATE users set password = ? WHERE username = ?', [passE, request.username]);
                } catch (e) {
                    console.log(e);
                }
                return res.status(200).send({ success: 'Contraseña actualizada correctamente' });
            } else {
                return res.status(400).send({ success: 'Las contraseñas no coinciden' });
            }
        } else {
            return res.status(400).send({ success: 'Unauthorized' });
        }
    }
}

export const userController = new UserController();