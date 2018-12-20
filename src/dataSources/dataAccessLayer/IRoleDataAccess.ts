import { Role } from '@ngscaffolding/models';


export interface IRoleDataAccess {
    getRole(name: string): Promise<Role>;
    getAllRoles() : Promise<Role[]>;
 }