import * as express from 'express';
import { Router, Request, Response, NextFunction } from 'express';

import { Logger } from './logger';
import { RequestHandler } from 'express-serve-static-core';
import OpenIDConnectRouter from './controllers/openIDConnect/openIDConnect.routing';
import UserRouter from './controllers/user/users.router';

export class RouterSetup {
  protected logger = new Logger(__filename);

  constructor(private express: any) {}

  configure() {
    let router = express.Router();

    // this.express.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    this.express.use('/', router);
    
    // User Endpoints
    this.express.use('/api/v1/user', UserRouter);

    router.post('/auth/token', this.express.oauth.grant(), (req: Request, res: Response, next: NextFunction) => this.getToken(req, res, next));

    // OpenID
    router.get('/connect/userinfo', this.express.oauth.authorise(), OpenIDConnectRouter);
  }

  public getToken(req: Request, res: Response, next: NextFunction) {
    next();
  }
}
