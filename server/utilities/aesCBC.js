const aesjs = require('aes-js');

class AesCBC {
  static decrypt(hexPassword) {
    const keyBytes = aesjs.utils.utf8.toBytes(AesCBC.key);
    const ivBytes = aesjs.utils.utf8.toBytes(AesCBC.iv);
    // Decrypt Password
    const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
    let decryptedBytes = aesCbc.decrypt(aesjs.utils.hex.toBytes(hexPassword));
    decryptedBytes = aesjs.padding.pkcs7.strip(decryptedBytes);
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }

  static encrypt(plainText) {
    const keyBytes = aesjs.utils.utf8.toBytes(AesCBC.key);
    const ivBytes = aesjs.utils.utf8.toBytes(AesCBC.iv);
    // Encrypt Password
    const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
    let textBytes = aesjs.utils.utf8.toBytes(plainText);
    textBytes = aesjs.padding.pkcs7.pad(textBytes);
    const encryptedBytes = aesCbc.encrypt(textBytes);
    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }
}

AesCBC.key = 'versicherungsausweisdeutschland1';
AesCBC.iv = 'sehenswurdigkeit';

module.exports = AesCBC;
