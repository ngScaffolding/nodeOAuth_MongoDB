import { PasswordHelper } from '../src/password.helper';
import * as prompt from 'prompt';
import { exit } from 'shelljs';

prompt.start();

prompt.get(['password'], function (err, result) {
    console.log('Command-line input received:');

    let salt = PasswordHelper.generateSalt();
    let enc = PasswordHelper.encodePassword(result.password, salt);

    console.log(`Password:${enc}`);
    console.log(`Salt:${salt}`);
    exit(1);
  });