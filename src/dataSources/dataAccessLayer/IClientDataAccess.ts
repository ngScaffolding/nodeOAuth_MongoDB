import { IClientModel } from "../../models/src/index";

export interface IClientDataAccess {
   getClientFromID(clientId: string, clientSecret?: string) : Promise<IClientModel>
}