import { Router } from 'express';
import FormController from '../controllers/form.controller';

const router = Router();
const formController = new FormController();

router.post('/createform', formController.createForm);
router.get('/fields/:formName', formController.getFormFields);
router.put('/fields', formController.updateFormFields);

export default router;
