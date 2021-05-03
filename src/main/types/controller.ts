export interface ISignInReq {
  username: string;
  password: string;
}

export interface ISignUpReq {
  username: string;
  password: string;
  displayName?: string;
  gender?: string;
  email?: string;
  roleId?: number
}
