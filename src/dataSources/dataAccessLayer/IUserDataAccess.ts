import { IUserModel } from "../../models/IUser.model";

export interface IUserDataAccess {
    getUserFromID(userId: string, password?: string): Promise<IUserModel>;
    userLoggedOn(userId: string);
    userLogonFailed(userId: string);

    getUsers(adminRoles: string[]): Promise<IUserModel[]>;
    addUser(user: IUserModel);
    updateUser(user: IUserModel);
}