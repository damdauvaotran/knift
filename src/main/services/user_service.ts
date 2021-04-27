// @ts-nocheck
import cryptoRandomString from 'crypto-random-string';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models';
import { env } from '../constants';
import { controllerType, modelType } from '../types';

const jwtPrivateKey = env.PRIVATE_KEY_JWT;

export const signUp = async (userDTO: controllerType.ISignUpReq) => {
  const { username, password, gender, displayName } = userDTO;
  const user = await db.User.findOne({ where: { username } });
  if (user !== null) {
    throw new Error('User exist');
  }

  const hashedPassword = await bcrypt.hash(password, env.SALT_ROUNDS);
  console.log({
    username,
    password: hashedPassword,
    gender: gender,
    roleId: 1,
    avatar: 'saaa',
    displayName: displayName,
    email: 'abcc@gmail.com',
  });
  try {
    const createdUser = await db.User.create({
      username,
      password: hashedPassword,
      gender: gender,
      roleId: 1,
      avatar: '',
      displayName: displayName,
      email: 'abcc@gmail.com',
    });
    return { username };
  } catch (e) {
    console.log(e);
  }
};

export const login = async (userDTO: any) => {
  const { username, password } = userDTO;
  try {
    const user = await db.User.findOne({
      where: { username },
      include : {
        model: db.Role,
      }
    });

    if (user === null) {
      throw new Error('Invalid login info');
    }
    const encryptedTruePassword = user.password;

    const isPasswordCorrect = await bcrypt.compare(
      password,
      encryptedTruePassword
    );
    if (isPasswordCorrect) {
      const token = jwt.sign(
        { displayName : user.displayName, email: user.email, id: user.userId, role: user.role?.name },
        jwtPrivateKey,
        { expiresIn: 8640000 }
      ); // 100 days
      return token;
    }
    throw new Error('Invalid login info');
  } catch (e) {
    console.error(e);
    throw new Error(e.toString());
  }
};

export const getUserInfo = async (userId) => {
  try {
    const userInfo = await db.User.findOne({
      where: { userId },
      include: [
        {
          model: db.Lists,
          required: false,
        },
      ],
    });
    if (userInfo) {
      return userInfo;
    }
    throw new Error('User not exist');
  } catch (e) {
    throw new Error(e.toString());
  }
};

export default {
  signUp,
  login,
  getUserInfo,
};
