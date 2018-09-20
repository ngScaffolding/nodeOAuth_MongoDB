export interface ITokenModel {
    accessToken: string,
    accessTokenExpiresOn: Date,
    client : object,
    clientId: string,
    refreshToken: string,
    refreshTokenExpiresOn:  Date,
    user : object,
    userId: string
}