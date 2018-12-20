import { AuthUser } from "@ngscaffolding/models";

export interface IUserModel extends AuthUser {
    id?: any;
    salt: string;
    password: string;
    passwordExpires: Date;
    passwordFailures: number;
    passwordLastFailed: Date;
    changeNextLogon: boolean;
    confirmHash: string;
    confirmExpires: Date;
    emailConfirmed: boolean;
    isLocked: boolean;
}