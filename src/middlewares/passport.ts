import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt'
import config from '../config/config'
import { connect } from '../database';

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
}

export default new Strategy(opts, async (payload, done) => {
    try {
        const CONN = await connect();
        const RESULT: any = await CONN.query('SELECT * FROM users WHERE id = ?', [payload.id]);
        if (RESULT[0].length > 0) {
            const USERString = JSON.stringify(RESULT[0]);
            const user = JSON.parse(USERString)[0];
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        console.log(error);
    }
})

export const checkIsInRole = (...roles: any) => (req: any, res: any, next: any): Promise<Response> => {
    if (!req.user) {
        return res.status(401).send({ Error: 'Not authorized' });
    }

    const hasRole = roles.find((role: any) => req.user.role === role)
    if (!hasRole) {
        return res.status(401).send({ Error: 'Not authorized' });
    }
    return next()
}