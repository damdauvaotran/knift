// @ts-nocheck
const cryptoRandomString = require('crypto-random-string');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import db from '../models';

const { ResponseException } = require('../utils/exception');

const saltRounds = process.env.SALT_ROUNDS
  ? parseInt(process.env.SALT_ROUNDS, 10)
  : 10;
const saltLength = process.env.SALT_ROUNDS
  ? parseInt(process.env.SALT_LENGTH, 10)
  : 14;
const jwtPrivateKey = process.env.PRIVATE_KEY_JWT || '!bE8JX7!owd!W67&XEU9kw2W';

const UserService = {
  async signUp(userDTO) {
    const { username, password } = userDTO;
    const user = await db.User.findOne({ where: { username } });
    if (user !== null) {
      throw new ResponseException('User exist');
    }
    try {
      const salt = cryptoRandomString({ length: 10 });
      const hashedPassword = await bcrypt.hash(
        password + salt,
        parseInt(saltRounds, 10)
      );
      const createdUser = await db.User.create({
        username,
        password: hashedPassword,
        salt,
        gender: 'MALE',
        roleId: 1,
        avatar: '',
        displayName: '2',
        email: 'abcc@gmail.com',
      });
      return { username };
    } catch (e) {
      throw new ResponseException(e.toString());
    }
  },

  async login(userDTO) {
    const { username, password } = userDTO;
    try {
      const user = await db.User.findOne({
        where: { username },
      });

      if (user === null) {
        throw new ResponseException('Invalid login info');
      }
      const encryptedTruePassword = user.password;
      const { salt } = user;

      const isPasswordCorrect = await bcrypt.compare(
        password + salt,
        encryptedTruePassword
      );

      if (isPasswordCorrect) {
        const token = jwt.sign(
          { username, id: user.userId, r: user.role },
          jwtPrivateKey,
          { expiresIn: 8640000 }
        ); // 100 days
        return token;
      }
      throw new ResponseException('Invalid login info');
    } catch (e) {
      console.error(e);
      throw new ResponseException(e.toString());
    }
  },

  async getUserInfo(userId) {
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
      throw new ResponseException('User not exist');
    } catch (e) {
      throw new ResponseException(e.toString());
    }
  },
};

module.exports = UserService;
