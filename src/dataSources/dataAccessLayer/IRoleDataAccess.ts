import { Role } from '../../models/index';


export interface IRoleDataAccess {
    getRole(name: string): Promise<Role>;
    getAllRoles() : Promise<Role[]>;
 }