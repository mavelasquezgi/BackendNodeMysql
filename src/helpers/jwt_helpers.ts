import jwt from 'jsonwebtoken'
import config from '../config/config'

export const createToken = (userId: string, expiresIn: number) => {
    return new Promise((resolve, reject) => {
        const payload = {
            id: userId,
        }
        const options = {
            expiresIn: expiresIn,
            issuer: 'onnews.com.co',
            audience: String(userId)
        }
        jwt.sign(payload, config.jwtSecret, options, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    });
}