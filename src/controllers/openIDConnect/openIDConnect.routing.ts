import { Router, Request, Response, NextFunction } from "express";
import { IDataAccessLayer } from "../../dataSources/dataAccessLayer";
var DataSourceSwitch = require('../../dataSourceSwitch');

export class OpenIDConnectRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  public getUserInfo(req: Request, res: Response, next: NextFunction) {

    let ds = DataSourceSwitch.default.dataSource as IDataAccessLayer;
    
    next();

  }

  init() {
    // this.router.get("/", this.getAll);
    this.router.get("/", this.getUserInfo);
  }
}

// Create the HeroRouter, and export its configured Express.Router
const openIDConnectRouter = new OpenIDConnectRouter().router

export default openIDConnectRouter;
