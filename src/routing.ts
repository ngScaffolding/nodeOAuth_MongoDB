import * as express from 'express';
import { Router, Request, Response, NextFunction } from 'express';

import { Logger } from './logger';
import AuthorisationRouter from './authorisation.router';
import { RequestHandler } from "express-serve-static-core";

export class RouterSetup {
  protected logger = new Logger(__filename);

  constructor(private express: express.Application) {}

  configure() {
    let router = express.Router();

    // this.express.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    this.express.use('/', router);
    //this.express.use('/auth', AuthorisationRouter);

  router.post('/auth/token', (req: Request, res: Response, next: NextFunction) => this.getToken(req, res, next));
  }

  public getToken(req: Request, res: Response, next: NextFunction) {
    this.express['oauth'].server.token();
   }
}
