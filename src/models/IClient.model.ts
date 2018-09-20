export interface IClientModel {
    clientId: string;
    redirectUris?: string[];
    grants: string[];
    accessTokenLifetime?: number;
    refreshTokenLifetime?: number;
    [key: string]: any;
}