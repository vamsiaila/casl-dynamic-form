import { Response } from 'express';
import { permittedFieldsOf } from '@casl/ability/extra';
import FormModel from '../models/form.model';
import FormDataModel from '../models/formdata.model';

export default class FormDataController {
  getFormData = async (request: any, response: Response) => {
    try {
      const { formName, formDataId } = request.params;
      const hasReadDataAbility = request.ability.can('read', formName);
      if (!hasReadDataAbility) {
        return response.status(403).send({
          status: false,
          error: { message: `You don't have ability to read data from form ${formName}` }
        });
      }
      const form = await FormModel.findOne({ formName });
      if (!form) {
        return response.status(404).send({ status: false, error: { message: 'Form not found.' } });
      }
      const formFields = form.fields.map(field => field.fieldName);
      const options = { fieldsFrom: (rule: any) => rule.fields || formFields };
      const allowedFieldsToRead = permittedFieldsOf(request.ability, 'read', formName, options);
      const projection: any = {};
      allowedFieldsToRead.forEach((field: string) => projection[`data.${field}`] = 1);
      const formData = await FormDataModel.findById(formDataId, projection).lean().exec();
      if (!formData) {
        return response.status(404).send({ status: false, error: { message: 'Form Data not found.' } });
      }
      return response.send({ status: true, data: formData.data });
    } catch (error) {
      console.error('FormDataController.getFormData', error);
      return response.status(500).send({ status: false, error: { message: 'Something went wrong.' } });
    }
  };

  addFormData = async (request: any, response: Response) => {
    try {
      const { formName } = request.body;
      const hasAddDataAbility = request.ability.can('create', formName);
      if (!hasAddDataAbility) {
        return response.status(403).send({
          status: false,
          error: { message: `You don't have ability to add data to form ${formName}` }
        });
      }
      const form = await FormModel.findOne({ formName });
      if (!form) {
        return response.status(404).send({ status: false, error: { message: 'Form not found.' } });
      }
      const formFields = form.fields.map(field => field.fieldName);
      const options = { fieldsFrom: (rule: any) => rule.fields || formFields };
      const allowedFieldsToAdd = permittedFieldsOf(request.ability, 'create', formName, options);
      const formData: any = {};
      const errors: string[] = [];
      const postData = request.body;
      allowedFieldsToAdd.forEach((field: string) => {
        const fieldMetadata: any = form.fields.find((formField: any) => formField.fieldName === field);
        if (fieldMetadata.required && !postData.hasOwnProperty(field)) {
          return errors.push(`${field} is required.`);
        }
        if (typeof postData[field] !== fieldMetadata.fieldType) {
          return errors.push(`${field} must be ${fieldMetadata.fieldType}`);
        }
        formData[field] = postData[field];
      });
      if(errors.length) {
        return response.status(400).send({ status: false, error: { message: errors.join(', ') } });
      }
      const newFormData = new FormDataModel({
        form: form._id,
        data: formData
      });
      await newFormData.save();
      return response.send({ status: true, data: { message: 'Form data added successfully.' } });
    } catch (error) {
      console.error('FormDataController.addFormData', error);
      return response.status(500).send({ status: false, error: { message: 'Something went wrong.' } });
    }
  };

  updateFormData = async (request: any, response: Response) => {
    try {
      const { formName, formDataId } = request.body;
      const hasUpdateDataAbility = request.ability.can('update', formName);
      if (!hasUpdateDataAbility) {
        return response.status(403).send({
          status: false,
          error: { message: `You don't have ability to update data in form ${formName}` }
        });
      }
      const form = await FormModel.findOne({ formName });
      if (!form) {
        return response.status(404).send({ status: false, error: { message: 'Form not found.' } });
      }
      const formData = await FormDataModel.findById(formDataId).lean().exec();
      if (!formData) {
        return response.status(404).send({ status: false, error: { message: 'Form Data not found.' } });
      }
      const formFields = form.fields.map(field => field.fieldName);
      const options = { fieldsFrom: (rule: any) => rule.fields || formFields };
      const allowedFieldsToUpdate = permittedFieldsOf(request.ability, 'update', formName, options);
      const dataToUpdate: any = formData.data;
      const errors: string[] = [];
      const postData = request.body;
      allowedFieldsToUpdate.forEach((field: string) => {
        const fieldMetadata: any = form.fields.find((formField: any) => formField.fieldName === field);
        if (fieldMetadata.required && !postData.hasOwnProperty(field)) {
          return errors.push(`${field} is required.`);
        }
        if (typeof postData[field] !== fieldMetadata.fieldType) {
          return errors.push(`${field} must be ${fieldMetadata.fieldType}`);
        }
        dataToUpdate[field] = postData[field];
      });
      if(errors.length) {
        return response.status(400).send({ status: false, error: { message: errors.join(', ') } });
      }
      await FormDataModel.findByIdAndUpdate(formDataId, { data: dataToUpdate }).lean().exec();
      return response.send({ status: true, data: { message: 'Form data updated successfully.' } });
    } catch (error) {
      console.error('FormDataController.updateFormData', error);
      return response.status(500).send({ status: false, error: { message: 'Something went wrong.' } });
    }
  };
}
