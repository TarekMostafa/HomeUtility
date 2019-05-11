const aesjs = require('aes-js');

class AesCBC {
  static decrypt(hexPassword) {
    const key = 'versicherungsausweisdeutschland1';
    const iv = 'sehenswurdigkeit';
    const keyBytes = aesjs.utils.utf8.toBytes(key);
    const ivBytes = aesjs.utils.utf8.toBytes(iv);
    // Decrypt Password
    const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
    let decryptedBytes = aesCbc.decrypt(aesjs.utils.hex.toBytes(hexPassword));
    decryptedBytes = aesjs.padding.pkcs7.strip(decryptedBytes);
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }
}

module.exports = AesCBC;
