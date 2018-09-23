import { IOAuthClientModel } from "../mongodb/models/clients.model";

export interface IClientDataAccess {
   getClientFromID(clientId: string, clientSecret?: string) : Promise<IOAuthClientModel>
}