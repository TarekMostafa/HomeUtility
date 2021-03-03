class Exception extends Error {
    constructor(message, params){
        super(message);
        this.params = params;
    }
}

module.exports = Exception;