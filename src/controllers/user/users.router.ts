import { Router, Request, Response, NextFunction } from 'express';
import { CoreMenuItem, BasicUser, DashboardModel } from '@ngscaffolding/models';
import { IDataAccessLayer } from '../../dataSources/dataAccessLayer';
import { checkUser } from '../../auth/checkUser';
import { forkJoin } from 'rxjs';
import canIAdminister from '../../auth/canIAdmninster';
import { IUserModel } from '../../models/IUser.model';
import getAdminRolesForUser from '../../auth/getAdminRolesForUser';

const winston = require('../../config/winston');

var DataSourceSwitch = require('../../dataSourceSwitch');

export class UserRouter {
    router: Router;
    private dataAccess: IDataAccessLayer;
  
    constructor() {
      this.router = Router();
      this.init();

      this.dataAccess = DataSourceSwitch.default as IDataAccessLayer;
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
            var userDetails = req['userDetails'] as BasicUser;
            var dataAccess = DataSourceSwitch.default.dataSource;

            const roles = await this.dataAccess.getAllRoles();

            const users = await this.dataAccess.getUsers();

            var returnedUsers: IUserModel[] = [];

            users.forEach(user=>{
                const adminRoles = getAdminRolesForUser(user, roles);
                
                if(canIAdminister(userDetails.roles, adminRoles)){
                    returnedUsers.push(user);
                }
            });
            
            res.json(returnedUsers);
    }

       public async getUserFromId(req: Request, res: Response, next: NextFunction) {
        var userDetails = req['userDetails'] as BasicUser;
        const id = req.query.id;

        const loadedUser = await this.dataAccess.getUserFromID(id);
        
        const roles = await this.dataAccess.getAllRoles();

        const adminRoles = getAdminRolesForUser(loadedUser, roles);

        // Check if I can Administer this user or Is it me?
        if(userDetails.userId === id || canIAdminister(userDetails.roles, adminRoles)){
            res.json(loadedUser);
        } else {
            res.status(401).send({ message: 'Not Authorised for User' });
        }
    }

    public async addMenuItem(req: Request, res: Response, next: NextFunction) {
        var MenuItem = {};

        for (const key in req.body) {
            MenuItem[key] = req.body[key];
        }

        // const newMenuItem = await DB.addMenuItem(MenuItem as IMenuItem);
        // res.json(newMenuItem);
    }

    init() {
        this.router.get('/', this.getAll);
        this.router.get('/:id', this.getUserFromId);
        this.router.post('/', this.addMenuItem);
    }
}

const userReouter = new UserRouter().router;

export default userReouter;
