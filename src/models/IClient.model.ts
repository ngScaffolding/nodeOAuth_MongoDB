export interface IClientModel {
    id?: any;
    clientId: string;
    redirectUris?: string[];
    grants: string[];
    accessTokenLifetime?: number;
    refreshTokenLifetime?: number;
    [key: string]: any;
}