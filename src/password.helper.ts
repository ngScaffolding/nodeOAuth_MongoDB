const bcrypt = require('bcrypt');

export class PasswordHelper {
  public static encodePassword(password: string, salt: string): string {

    var encodedPassword = bcrypt.hashSync(password, salt);
    
    return encodedPassword
  }

  public static generateSalt(): string {
    let saltRounds = 10;
    return bcrypt.genSaltSync(saltRounds);
  }
}
