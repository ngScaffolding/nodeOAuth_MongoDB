import { Role, IUserModel } from '../models/src/index';

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
