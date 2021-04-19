import {Gender, Role} from './common'

export interface IUserModel {
  userId?: number;
  username?: string;
  password?: string;
  gender?: Gender;
  displayName?: string;
  email?: string;
  avatar?: string;
  role?: IRoleModel;
  classes?: IClassModel[];
}
export interface ISubjectModel {
  subjectId?: number;
  name?: string;
}

export interface IRoleModel {
  roleId?: number;
  name?: Role;
  users: IUserModel[];
  permissions?: IPermissionModel[];
}

export interface IPermissionModel {
  permissionId?: number;
  action?: string;
  resource?: string;
  roles?: IRoleModel[];
}

export interface ILessonModel {
  lessonId?: number;
  name?: string;
  startTime?: number;
  endTime?: number;
  class?: IClassModel;
  conferences?: IConferenceModel[];
}

export interface IConferenceModel {
  conferenceId?: number;
  status?: string;
  startTime?: number;
  endTime?: number;
  class?: IClassModel;
}

export interface IClassModel {
  classId?: number;
  name?: string;
  startTime?: number;
  endTime?: number;
  users?: IUserModel[];
  lessons?: ILessonModel[];
}
