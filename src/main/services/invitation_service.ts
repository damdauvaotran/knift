import crypto from 'crypto';
import db from '../models';
const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = crypto
  .createHash('sha256')
  .update(String('secret_password'))
  .digest('base64')
  .substr(0, 32);
const IV_LENGTH = 16;

const encrypt = (text: string): string => {
  let iv = crypto.randomBytes(IV_LENGTH);
  console.log(ENCRYPTION_KEY.length);
  let cipher = crypto.createCipheriv(algorithm, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (text: string): string => {
  let textParts = text.split(':');
  // @ts-ignore
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv(algorithm, ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export interface IInvitation {
  type: InvitationType;
  classId: number;
  expire?: number;
  userId?: number;
}

enum InvitationType {
  timeOut = 'TIMEOUT',
  userCustom = 'USERCUSTOM',
}

export const generateTimeOutInvitation = (
  classId: number,
  expire: number
): string => {
  const info: IInvitation = { classId, expire, type: InvitationType.timeOut };
  return encrypt(JSON.stringify(info));
};

export const generateUserInvitation = (
  classId: number,
  userId: number
): string => {
  const info: IInvitation = {
    classId,
    userId,
    type: InvitationType.userCustom,
  };
  return encrypt(JSON.stringify(info));
};

export const getInvitationInfo = async (invitationString: string) => {
  try {
    const invitationObj: IInvitation = JSON.parse(decrypt(invitationString));
    return invitationObj;
  } catch (e) {
    throw e;
  }
};

export const handleInvitation = async (
  invitationString: string,
  userId: number
) => {
  try {
    const invitationObj: IInvitation = JSON.parse(decrypt(invitationString));
    console.log(invitationObj);
    switch (invitationObj.type) {
      case InvitationType.timeOut: {
        if ((invitationObj.expire ?? 0) < new Date().getTime()) {
          throw new Error('Invitation expired');
        } else {
          await db.UserClass.create({ classId: invitationObj.classId, userId });
          return {};
        }
        break;
      }
      case InvitationType.userCustom: {
        if (invitationObj.userId !== userId) {
          throw new Error('Wrong invitation owner');
        } else {
          await db.UserClass.create({ classId: invitationObj.classId, userId });
          return {};
        }
        break;
      }
      default: {
        console.log('----- Invalid invitation type----' + invitationObj.type);
        throw new Error('Invalid invitation');
      }
    }
  } catch (e) {
    if (e.parent.code === 'ER_DUP_ENTRY') {
      throw new Error('You already in class');
    }
    throw e;
  }
};
