import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

import ExpressOAuthServer = require('node-oauth2-server');
import { OAuthModel } from './oauth.model';

var cors = require('cors')

import { RouterSetup } from './routing';

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: any; //express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();

    // Set oauth to be Our Implemenation
    const oauthModel = new OAuthModel();
    this.express.oauth = new ExpressOAuthServer({
      model: oauthModel,
      grants: ['password']
    })

    this.middleware();

   let router = new RouterSetup(this.express);
   router.configure();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(cors())
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }
}

export default new App().express;