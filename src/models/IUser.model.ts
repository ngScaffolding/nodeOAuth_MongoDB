export interface IUserModel {
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