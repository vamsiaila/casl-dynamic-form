import { Router } from 'express';
import caslAbility from '../middlewares/caslability';
import userRoute from './user.route';
import formRoute from './form.route';
import formDataRoute from './formdata.route';

const router = Router();

router.use('/user', userRoute);
router.use('/form', caslAbility, formRoute);
router.use('/formdata', caslAbility, formDataRoute);

export default router;
