import { Request, Response } from 'express';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import UserModel from '../models/user.model';

export default class UserController {

  addUser = async (request: any, response: Response) => {
    try {
      const hasAddUserAbility = request.ability.can('add', 'User');
      if(!hasAddUserAbility) {
        return response.status(403).send({ status: false, error: { message: `You don't have ability to add User` } });
      }
      const { firstName, lastName, email, password } = request.body;
      if (!firstName) {
        return response.status(400).send({ status: false, error: { message: 'firstName is required.' } });
      }
      if (!lastName) {
        return response.status(400).send({ status: false, error: { message: 'lastName is required.' } });
      }
      if (!email) {
        return response.status(400).send({ status: false, error: { message: 'email is required.' } });
      }
      if (!password) {
        return response.status(400).send({ status: false, error: { message: 'password is required.' } });
      }
      const userExist = await UserModel.findOne({ email }).lean().exec();
      if(userExist) {
        return response.status(400).send({ status: false, error: { message: `User already exist with email ${email}` } });
      }
      const encryptedPassword = await hash(password, 10);
      const user = new UserModel({
        firstName,
        lastName,
        email,
        password: encryptedPassword
      });
      await user.save();
      return response.send({ status: true, data: { message: 'User added successfully' } });
    } catch (error) {
      console.error('UserController.addUser', error);
      return response.status(500).send({ status: false, error: { message: 'Something went wrong.' } });
    }
  };

  login = async (request: Request, response: Response) => {
    try{
      const { email, password } = request.body;
      if (!email) {
        return response.status(400).send({ status: false, error: { message: 'email is required.' } });
      }
      if (!password) {
        return response.status(400).send({ status: false, error: { message: 'password is required.' } });
      }
      const user = await UserModel.findOne({ email }).lean().exec();
      if(!user) {
        return response.status(401).send({ status: false, error: { message: `Invalid credentials.` } });
      }
      const passwordMatched = await compare(password, user.password);
      if(!passwordMatched) {
        return response.status(401).send({ status: false, error: { message: `Invalid credentials.` } });
      }
      const token = sign({ userId: user._id, abilities: user.abilities }, process.env.JWT_SECRET || '');
      return response.send({ status: true, data: { token } });
    } catch (error) {
      console.error('UserController.login', error);
      return response.status(500).send({ status: false, error: { message: 'Something went wrong.' } });
    }
  };

  getUserAbilities = async (request: any, response: Response) => {
    try {
      const hasReadUserAbility = request.ability.can('read', 'User');
      if(!hasReadUserAbility) {
        return response.status(403).send({ status: false, error: { message: `You don't have ability to read User abilities` } });
      }
      const user = await UserModel.findOne({ email: request.params.email }).lean().exec();
      if(!user) {
        return response.status(404).send({ status: false, error: { message: 'User not found.' } });
      }
      return response.send({ status: true, data: user.abilities });
    } catch (error) {
      console.error('UserController.getUserAbilities', error);
      return response.status(500).send({ status: false, error: { message: 'Something went wrong.' } });
    }
  };

  updateAbilities = async (request: any, response: Response) => {
    try{
      const hasUpdateAbilitiesAbility = request.ability.can('update', 'Ability');
      if(!hasUpdateAbilitiesAbility) {
        return response.status(403).send({ status: false, error: { message: `You don't have ability to update User abilities` } });
      }
      const { email, abilities } = request.body;
      const user = await UserModel.findOne({ email });
      if(!user) {
        return response.status(404).send({ status: false, error: { message: 'User not found' } });
      }
      user.abilities = abilities;
      await user.save();
      return response.send({ status: true, data: { message: 'User abilities updated successfully' } })
    } catch (error) {
      console.error('UserController.addAbilities', error);
      return response.status(500).send({ status: false, error: { message: 'Something went wrong.' } });
    }
  };

}
