import * as path from 'path';
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import authoriseRequest from './auth/authoriseRequest';

import ExpressOAuthServer = require('node-oauth2-server');
import { OAuthModel } from './oauth.model';

var winston = require('./config/winston');
var cors = require('cors')

import { RouterSetup } from './routing';

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: any; //express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    winston.info('Auth Starting');
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
    this.express.set('views', path.join(__dirname, 'views'));
    this.express.set('view engine', 'pug');

    this.express.use(morgan('combined', { stream: winston.stream }));
    this.express.use(bodyParser.json());
    this.express.use(cors())
    this.express.use(authoriseRequest);
    this.express.use(bodyParser.urlencoded({ extended: false }));
    
    this.express.use(function(err,req,res,next){
      if(err) {
        winston.error(err);
        console.error(err);
      }
    });
  }
}

export default new App().express;