import { Router, Request, Response, NextFunction } from 'express';
import { RequestHandlerParams } from 'express-serve-static-core';
import { IUserModel } from '../models/index';
import getAdminRolesForUser from './getAdminRolesForUser';
var DataSourceSwitch = require('../dataSourceSwitch');

export default function canIAdminister(me: IUserModel, userToAdminister: IUserModel, checkAll = false): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    var dataAccess = DataSourceSwitch.default.dataSource;

    if (me.userId === userToAdminister.userId) {
      // It's a me!
      resolve(true);
    }

    if (me.roles.some(role => role === 'admin')) {
      // I'm the daddy
      resolve(true);
    }

    dataAccess.getAllRoles().then(roles => {
      const authorisedRoles = getAdminRolesForUser(userToAdminister, roles);

      var authorisedMatches = 0;

      for(const myRole of me.roles){
        if (myRole === 'admin' || myRole === 'user_admin') {
          authorisedMatches++;
        }

        authorisedRoles.forEach(authorisedRole => {
          if (myRole === authorisedRole) {
            authorisedMatches++;
          }
        });
      }

      if (checkAll) {
        resolve(authorisedMatches === authorisedRoles.length);
      } else {
        resolve(authorisedMatches > 0);
      }
    });
  });
}
