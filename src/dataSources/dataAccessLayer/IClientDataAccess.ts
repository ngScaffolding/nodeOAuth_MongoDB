import { IClientModel } from "../../../../models/src/authModels/IClient.model";

export interface IClientDataAccess {
   getClientFromID(clientId: string, clientSecret?: string) : Promise<IClientModel>
}