import { Schema, model } from 'mongoose';

interface FormData {
    form: Schema.Types.ObjectId,
    data: object
}

const schema = new Schema<FormData>({
  form: {
    type: Schema.Types.ObjectId,
    ref: 'Form'
  },
  data: {
    type: Object,
    default: {}
  }
});

export default model('FormData', schema);
