import { Router } from 'express'
import passport from 'passport';
import { addressControllers } from '../controllers/address.controllers';
import { academicControllers } from '../controllers/academic.controllers';
import { checkIsInRole } from '../middlewares/passport';
import { Role } from '../models/role';
import { petitionsControllers } from '../controllers/petitions.controllers';
import { productControllers } from '../controllers/product.controlers';

class PremiumRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/cities', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ), addressControllers.cities);
        this.router.get('/citiesByDepartment/:idDepartment', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ), addressControllers.citiesByDepartment);
        this.router.get('/departments', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ), addressControllers.departments);
        this.router.get('/department/:idDepartment', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ), addressControllers.department);
        this.router.get('/allAddress', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ),addressControllers.allAddress);
        this.router.post('/createDepartment', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ), addressControllers.createDepartment);
        this.router.post('/createAddress', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ), addressControllers.createAddress);
        this.router.post('/createCity', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ), addressControllers.createCity);
        // routes academic 
        this.router.get('/programsByHeadquarters/:idHeadquarter', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ),academicControllers.programsByHeadquarters);
        this.router.get('/facultiesByHeadquarters/:idHeadquarter', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ),academicControllers.facultiesByHeadquarters); 
        this.router.get('/programsByFaculties/:idFaculty/:idHeadquarter', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ),academicControllers.programsByFaculties);
        this.router.post('/createFaculty', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ), academicControllers.createFaculty);
        this.router.get('/faculties', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ), academicControllers.faculties);
        this.router.get('/programs', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ), academicControllers.programs);
        this.router.get('/headquarters', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ),academicControllers.headquarters); 
        // routes petitions
        this.router.get('/actas', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ),petitionsControllers.actasAll); 
        // routes products
        this.router.post('/createproduct', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ),productControllers.createProduct); 
    }
}

const premiumRoutes = new PremiumRoutes();
export default premiumRoutes.router;

