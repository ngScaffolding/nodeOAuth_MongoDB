import * as express from 'express';
import { Router, Request, Response, NextFunction } from 'express';

import { Logger } from './logger';
import { RequestHandler } from "express-serve-static-core";

export class RouterSetup {
  protected logger = new Logger(__filename);

  constructor(private express: any) {}

  configure() {
    let router = express.Router();

    // this.express.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    this.express.use('/', router);
    //this.express.use('/auth', AuthorisationRouter);

  router.post('/auth/token', this.express.oauth.grant() ,(req: Request, res: Response, next: NextFunction) => this.getToken(req, res, next));
  }

  public getToken(req: Request, res: Response, next: NextFunction) {
    next();
   }
}
