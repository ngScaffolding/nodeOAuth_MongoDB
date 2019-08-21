import { IUserModel } from "../../models/index";

export interface IUserDataAccess {
    getUserFromID(userId: string, password?: string): Promise<IUserModel>;
    userLoggedOn(userId: string);
    userLogonFailed(userId: string);

    getUsers(): Promise<IUserModel[]>;
    addUser(user: IUserModel);
    updateUser(user: IUserModel);
}