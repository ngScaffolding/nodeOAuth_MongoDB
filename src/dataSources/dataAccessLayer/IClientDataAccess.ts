import { IClientModel } from "ngscaffolding-models";

export interface IClientDataAccess {
   getClientFromID(clientId: string, clientSecret?: string) : Promise<IClientModel>
}