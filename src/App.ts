import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import authoriseRequest from './auth/authoriseRequest';

var jwt = require('express-jwt');
var cors = require('cors')

import { RouterSetup } from './routes/routing';

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();

   let router = new RouterSetup(this.express);
   router.configure();
  }

  // Configure Express middleware.
  private middleware(): void {
    // var jwtCheck = jwt({
    //   secret: process.env.OAUTH_SECRET
    // });
    
    // Enable the use of the jwtCheck middleware in all of our routes
    // this.express.use(jwtCheck);

    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(cors())
    this.express.use(authoriseRequest);
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }
}

export default new App().express;