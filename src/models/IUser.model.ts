export interface IUserModel {
    id?: any;
    salt: string;
    password: string;
    expires: Date;
    passwordFailures: number;
    passwordLastFailed: Date;
    changeNextLogon: boolean;
}