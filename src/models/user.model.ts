import { Schema, model } from 'mongoose';

interface RawRule {
    action: string | string[]
    subject?: string | string[]
    fields?: string[]
    conditions?: object
    inverted?: boolean
    reason?: string
}

interface User {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    abilities: RawRule[]
}

const schema = new Schema<User>({
  firstName: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  abilities: {
    type: [],
    default: []
  }
});

export default model('User', schema);
