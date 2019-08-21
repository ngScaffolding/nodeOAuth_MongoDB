import { Router, Request, Response, NextFunction } from 'express';
import { BasicUser, IUserModel } from '../../models/index';
import { IDataAccessLayer } from '../../dataSources/dataAccessLayer';
import getAdminRolesForUser from '../../auth/getAdminRolesForUser';
import canIAdminister from '../../auth/canIAdmninster';


const winston = require('../../config/winston');

var DataSourceSwitch = require('../../dataSourceSwitch');

export class RolesRouter {
  router: Router;
  private dataAccess: IDataAccessLayer;

  constructor() {
    this.router = Router();
    this.init();
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    var userDetails = req['userDetails'] as BasicUser;

    if (!userDetails) {
      res.sendStatus(401);
      return;
    }

    var dataAccess = DataSourceSwitch.default.dataSource;

    const roles = await dataAccess.getAllRoles();

    res.json(roles);
  }

  public async getUserFromId(req: Request, res: Response, next: NextFunction) {
    var userDetails = req['userDetails'] as IUserModel;
    const id = req.query.id;

    const loadedUser = await this.dataAccess.getUserFromID(id);

    // Check if I can Administer this user or Is it me?
    if (await canIAdminister(userDetails, loadedUser)) {
      res.json(loadedUser);
    } else {
      res.status(401).send({ message: 'Not Authorised for User' });
    }
  }
  public async addUser(req: Request, res: Response, next: NextFunction) {
    var userDetails = req['userDetails'] as IUserModel;
    var dataAccess = DataSourceSwitch.default.dataSource;

    var newUser = req.body as IUserModel;

    if (await canIAdminister(userDetails, newUser, true)) {
      dataAccess.addUser(newUser);
    } else {
      res.status(401).send({ message: 'Not Authorised to create for User' });
    }
  }
  public async updateUser(req: Request, res: Response, next: NextFunction) {
    var userDetails = req['userDetails'] as IUserModel;
    var dataAccess = DataSourceSwitch.default.dataSource;

    var newUser = req.body as IUserModel;

    if (await canIAdminister(userDetails, newUser, true)) {
      dataAccess.addUser(newUser);
    } else {
      res.status(401).send({ message: 'Not Authorised to create for User' });
    }
  }


  init() {
    // Get Roles
    this.router.get('/', this.getAll);

    // Get User
    this.router.get('/:id', this.getUserFromId);

    // Create User
    this.router.post('/', this.addUser);

    // Update User
    this.router.patch('/', this.updateUser);
  }
}

const roleRouter = new RolesRouter().router;

export default roleRouter;
