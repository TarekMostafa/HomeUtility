class AppMessageTranslation {
    constructor(messageFile){
        this.messageFile = messageFile;
    }

    translate(messageCode, messageParams){
        let message = this.messageFile[messageCode];
        if(message && messageParams) {
            if(Array.isArray(messageParams)) {
              for(let i=0; i<messageCode.length; i++) {
                message = message.replace('?', messageParams[i]);
              }
            } else {
              message = message.replace('?', messageParams);
            }
        }
        return message;
    }
}

module.exports = AppMessageTranslation;