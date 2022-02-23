import { Router } from 'express';
import UserController from '../controllers/user.controller';
import caslAbility from '../middlewares/caslability';

const router = Router();
const userController = new UserController();

router.post('/adduser', caslAbility, userController.addUser);
router.post('/login', userController.login);
router.get('/abilities/:email', caslAbility, userController.getUserAbilities);
router.put('/abilities', caslAbility, userController.updateAbilities);

export default router;
