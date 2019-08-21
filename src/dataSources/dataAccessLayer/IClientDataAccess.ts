import { IClientModel } from "../../models/index";

export interface IClientDataAccess {
   getClientFromID(clientId: string, clientSecret?: string) : Promise<IClientModel>
}