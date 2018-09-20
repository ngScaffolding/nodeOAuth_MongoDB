export interface IUserModel {
    salt: string;
    password: string;
    expires: Date;
    passwordFailures: number;
    passwordLastFailed: number;
    changeNextLogon: boolean;
}