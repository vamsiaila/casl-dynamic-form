import { Router } from 'express';
import FormDataController from '../controllers/formdata.controller';

const router = Router();
const formDataController = new FormDataController();

router.get('/get/:formName/:formDataId', formDataController.getFormData);
router.post('/add', formDataController.addFormData);
router.put('/update', formDataController.updateFormData);

export default router;
