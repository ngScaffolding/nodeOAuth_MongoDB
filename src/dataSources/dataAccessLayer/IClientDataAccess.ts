import { IClientModel } from "../../models/IClient.model";

export interface IClientDataAccess {
   getClientFromID(clientId: string, clientSecret?: string) : Promise<IClientModel>
}