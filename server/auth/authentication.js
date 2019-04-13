const crypto = require('crypto');
const bytes = require('utf8-bytes');

const SALT = 'krankenschwester';

class Authentication {
  static async encrypt(value) {
    const valueBytes = bytes(value);
    const saltBytes = bytes(SALT);
    const saltedValue = [...valueBytes, ...saltBytes];
    return crypto.createHash('sha256')
    .update(Buffer.from(saltedValue))
    .digest('hex');
  }
}

module.exports = Authentication;
