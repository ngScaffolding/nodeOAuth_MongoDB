import { IClientDataAccess } from "./IClientDataAccess";
import { IUserDataAccess } from './IUserDataAccess';

export interface IDataAccessLayer {
    clientDataAccess: IClientDataAccess;
    userDataAccess: IUserDataAccess;
}