import { Router, Request, Response, NextFunction } from 'express';
// import { MongoDBDataAccess } from './models/mongodb';
import { Observable } from 'rxjs/Observable';
import { ReferenceValue, BaseDataSource, ReferenceValueItem, RestApiDataSource } from '@ngscaffolding/models';
import { forkJoin } from 'rxjs/observable/forkJoin';
import * as express from 'express';


export class AuthorisationRouter {
  router: Router;
  // private dataAccess: MongoDBDataAccess;
    // ref to Express instance
  private expressApp: any;

  constructor() {
    this.router = Router();
    this.expressApp = require('express');

    this.init();
  }


  public getToken(req: Request, res: Response)  {
   const expressApp: any =  require('express');
   expressApp['oauth'].grant();
  }

  

  init() {
    // this.router.get('/', this.express['oauth'].grant());
    this.router.post('/token', this.getToken);
  }
}

const authorisationRouter = new AuthorisationRouter().router;

export default authorisationRouter;
