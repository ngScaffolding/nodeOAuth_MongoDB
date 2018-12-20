import { Router, Request, Response, NextFunction } from 'express';
import { RequestHandlerParams } from 'express-serve-static-core';
import { IUserModel } from '../models/IUser.model';
import { Role } from '@ngscaffolding/models';

export default function getAdminRolesForUser(user: IUserModel, allRoles: Role[]): string[] {
  let adminRoles = ['useradmin', 'superadmin'];

  user.roles.forEach(userRole => {
    let possibleAdminRoles = allRoles.filter(role => role.name === userRole);
    if (possibleAdminRoles) {
      possibleAdminRoles.forEach(foundAdmin => {
        adminRoles.push(foundAdmin.name);
      });
    }
  });

  return adminRoles;
}
