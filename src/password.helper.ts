var crypto = require('crypto');

export class PasswordHelper {
  public static encodePassword(password: string, salt: string): string {
    var hash = crypto.createHmac('sha512',salt); /** Hashing algorithm sha512 */

    hash.update(password);
    var encodedPassword = hash.digest('hex');
    
    return encodedPassword
  }

  public static generateSalt(): string {
    let length = 16;

    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex') /** convert to hexadecimal format */
      .slice(0, length); /** return required number of characters */
  }
}
