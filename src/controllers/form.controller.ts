import { Response } from 'express';
import FormModel from '../models/form.model';

export default class FormController {
  createForm = async (request: any, response: Response) => {
    try{
      const hasCreateFormAbility = request.ability.can('create', 'Form');
      if(!hasCreateFormAbility) {
        return response.status(403).send({ status: false, error: { message: `You don't have ability to create Form.` } });
      }
      const { formName, fields } = request.body;
      const formExist = await FormModel.findOne({ formName }).lean().exec();
      if(formExist) {
        return response.status(400).send({ status: false, error: { message: `Form with name ${formName} already exists` } });
      }
      const form = new FormModel({
        formName,
        fields
      });
      await form.save();
      return response.send({ status: true, data: { message: 'Form added successfully' } });
    } catch (error) {
      console.error('FormController.addAbilities', error);
      return response.status(500).send({ status: false, error: { message: 'Something went wrong.' } });
    }
  };

  getFormFields = async (request: any, response: Response) => {
    try {
      const hasGetFormAbility = request.ability.can('read', 'Form');
      if(!hasGetFormAbility) {
        return response.status(403).send({ status: false, error: { message: `You don't have ability to read Form fields` } });
      }
      const form = await FormModel.findOne({ formName: request.params.formName }).lean().exec();
      if(!form) {
        return response.status(404).send({ status: false, error: { message: 'Form not found' } });
      }
      return response.send({ status: true, data: form.fields });
    } catch (error) {
      console.error('FormController.getGormFields', error);
      return response.status(500).send({ status: false, error: { message: 'Something went wrong' } });
    }
  };

  updateFormFields = async (request: any, response: Response) => {
    try {
      const hasUpdateFormAbility = request.ability.can('update', 'Form');
      if(!hasUpdateFormAbility) {
        return response.status(403).send({ status: false, error: { message: `You don't have ability to update Form fields` } });
      }
      const { formName, fields } = request.body;
      const form = await FormModel.findOne({ formName });
      if(!form) {
        return response.status(404).send({ status: false, error: { message: 'Form not found' } });
      }
      form.fields = fields;
      await form.save();
      return response.send({ status: true, data: { message: 'Form fields updated successfully' } });
    } catch (error) {
      console.error('FormController.updateFormFields', error);
      return response.status(500).send({ status: false, error: { message: 'Something went wrong.' } });
    }
  };
}
