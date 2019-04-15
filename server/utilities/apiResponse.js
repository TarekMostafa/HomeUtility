const appMessages = require('./appMessages');

class APIResponse {
  static getAPIResponse(success, payload, messageCode, messageParams) {
    let message = appMessages[messageCode];
    if(message && messageParams) {
      if(Array.isArray(messageParams)) {
        for(let i=0; i<messageCode.length; i++) {
          message = message.replace('?', messageParams[i]);
        }
      } else {
        message = message.replace('?', messageParams);
      }
    }
    return {
      success,
      payload,
      message
    };
  }
}

module.exports = APIResponse;
