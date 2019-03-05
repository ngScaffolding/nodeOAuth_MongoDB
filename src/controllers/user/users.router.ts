import { Router, Request, Response, NextFunction } from 'express';
import { BasicUser } from '@ngscaffolding/models';
import { IDataAccessLayer } from '../../dataSources/dataAccessLayer';
import { IUserModel } from '@ngscaffolding/models';
import getAdminRolesForUser from '../../auth/getAdminRolesForUser';
import canIAdminister from '../../auth/canIAdmninster';


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

    if (!userDetails) {
      res.sendStatus(401);
      return;
    }

    var dataAccess = DataSourceSwitch.default.dataSource;

    const roles = await dataAccess.getAllRoles();

    const users = await dataAccess.getUsers();

    var returnedUsers: IUserModel[] = [];

    users.forEach(user => {
      const adminRoles = getAdminRolesForUser(user, roles);

      if (canIAdminister(userDetails.roles, adminRoles)) {
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
    if (userDetails.userId === id || canIAdminister(userDetails.roles, adminRoles)) {
      res.json(loadedUser);
    } else {
      res.status(401).send({ message: 'Not Authorised for User' });
    }
  }
  public async addUser(req: Request, res: Response, next: NextFunction) {
    var userDetails = req['userDetails'] as BasicUser;
    var dataAccess = DataSourceSwitch.default.dataSource;

    var newUser = req.body as IUserModel;

    const roles = await this.dataAccess.getAllRoles();

    const adminRoles = getAdminRolesForUser(newUser, roles);

    if (canIAdminister(userDetails.roles, adminRoles, true)) {
      dataAccess.addUser(newUser);
    } else {
      res.status(401).send({ message: 'Not Authorised to create for User' });
    }
  }
  public async updateUser(req: Request, res: Response, next: NextFunction) {
    var userDetails = req['userDetails'] as BasicUser;
    var dataAccess = DataSourceSwitch.default.dataSource;

    var newUser = req.body as IUserModel;

    const roles = await this.dataAccess.getAllRoles();

    const adminRoles = getAdminRolesForUser(newUser, roles);

    if (canIAdminister(userDetails.roles, adminRoles, true)) {
      dataAccess.addUser(newUser);
    } else {
      res.status(401).send({ message: 'Not Authorised to create for User' });
    }
  }
  public async registerUser(req: Request, res: Response, next: NextFunction) {}

  public async confirmUser(req: Request, res: Response, next: NextFunction) {}
  public async changePassword(req: Request, res: Response, next: NextFunction) {}
  public async setPassword(req: Request, res: Response, next: NextFunction) {}

  init() {
    // Get Users
    this.router.get('/', this.getAll);

    // Get User
    this.router.get('/:id', this.getUserFromId);

    // Create User
    this.router.post('/', this.addUser);

    // Update User
    this.router.patch('/', this.updateUser);

    // register User
    this.router.post('/register', this.registerUser);

    // Confirm Registration
    this.router.get('/confirm/:id', this.confirmUser);

    // Set Password (For Admin)
    this.router.post('/setPassword', this.setPassword);

    // Change Password (For the User)
    this.router.post('/changePassword', this.changePassword);
  }
}

const userRouter = new UserRouter().router;

export default userRouter;
