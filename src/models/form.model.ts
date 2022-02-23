import { Schema, model } from 'mongoose';

interface Field {
    fieldName: string,
    fieldType: string,
    required: boolean
}

interface Form {
    formName: string,
    fields: Field[]
}

const fieldSchema = new Schema<Field>({
  fieldName: {
    type: String,
    required: true
  },
  fieldType: {
    type: String,
    required: true
  },
  required: {
    type: 'boolean',
    default: false
  }
});

const schema = new Schema<Form>({
  formName: {
    type: String,
    require: true
  },
  fields: {
    type: [fieldSchema],
    default: []
  }
});

export default model('Form', schema);
