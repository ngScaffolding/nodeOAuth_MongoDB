import { Router, Request, Response, NextFunction } from 'express';
import { RequestHandlerParams } from 'express-serve-static-core';
import { IUserModel } from '../models/src';
import getAdminRolesForUser from './getAdminRolesForUser';
var DataSourceSwitch = require('../dataSourceSwitch');

export default function canIAdminister(me: IUserModel, userToAdminister: IUserModel, checkAll = false): boolean {
  var dataAccess = DataSourceSwitch.default.dataSource;

  if (me.userId === userToAdminister.userId) {
    // It's me!
    return true;
  }

  dataAccess.getAllRoles().then(roles => {
    const authorisedRoles = getAdminRolesForUser(userToAdminister, roles);

    var authorisedMatches = 0;

    me.roles.forEach(myRole => {
      if (myRole === 'admin' || myRole === 'user_admin') {
        authorisedMatches++;
      }

      authorisedRoles.forEach(authorisedRole => {
        if (myRole === authorisedRole) {
          authorisedMatches++;
        }
      });
    });

    if (checkAll) {
      return authorisedMatches === authorisedRoles.length;
    } else {
      return authorisedMatches > 0;
    }
  });

  return false;
}
