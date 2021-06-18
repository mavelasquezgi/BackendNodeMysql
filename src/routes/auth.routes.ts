import { Router } from 'express'
import passport from 'passport';
import { userController } from '../controllers/user.controller';
import { checkIsInRole } from '../middlewares/passport';
import { Role } from '../models/role';

class IndexRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ), userController.users);
        this.router.post('/signup', userController.signup);
        this.router.post('/signin', userController.signin);
        this.router.post('/changepassword', passport.authenticate('jwt', { session: false }), userController.changePassword);
    }
}

const indexRoutes = new IndexRoutes();
export default indexRoutes.router;