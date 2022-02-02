import { Router } from 'express'
import passport from 'passport';
import { checkIsInRole } from '../middlewares/passport';
import { Role } from '../models/role';
import { productControllers } from '../controllers/product.controllers';
import { categoryControllers } from '../controllers/category.controllers';
import multer from '../libs/multer'

class PremiumRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        // routes products 
        // post
        this.router.post('/createproduct', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ),multer.single('image'),productControllers.createProduct);
        this.router.post('/updateproduct', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ),multer.single('image'),productControllers.updateProduct);
        this.router.post('/createcategory', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ),categoryControllers.createCategory);
        this.router.post('/updatecategory', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ),categoryControllers.updateCategory); 
        // get
        this.router.get('/categories', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ),categoryControllers.categories);
        this.router.get('/category/:name', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ),categoryControllers.category);
        this.router.get('/delcategory/:name', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ),categoryControllers.delcategory);
        this.router.get('/allproducts', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ),productControllers.allproducts);
        this.router.get('/product/:id', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ),productControllers.getproduct);
        this.router.get('/delproduct/:id', passport.authenticate('jwt', { session: false }), checkIsInRole(Role.Admin, Role.Official ),productControllers.delproduct);
        

    }
}

const premiumRoutes = new PremiumRoutes();
export default premiumRoutes.router;

