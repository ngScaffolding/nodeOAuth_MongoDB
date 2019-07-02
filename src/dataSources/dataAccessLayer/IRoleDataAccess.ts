import { Role } from '../../models/src/index';


export interface IRoleDataAccess {
    getRole(name: string): Promise<Role>;
    getAllRoles() : Promise<Role[]>;
 }