import { IOAuthUsersModel } from "../mongodb/models/users.model";

export interface IUserDataAccess {
    getUserFromID(userId: string, password?: string): Promise<IOAuthUsersModel>;
    userLoggedOn(userId: string);
    userLogonFailed(userId: string);
}