const _ = require('lodash');

class Common {
  static getNumber(value, defaultValue) {
    if(!_.isNil(value)) {
      return _.isNaN(_.toNumber(value)) ? defaultValue : _.toNumber(value);
    } else {
      return defaultValue;
    }
  }

  static getText(value, defaultValue) {
    if(!_.isNil(value)) {
      return value;
    } else {
      return defaultValue;
    }
  }

  static getDate(value, defaultValue, next) {
    if(!_.isNil(value)) {
      const parsedDate = Date.parse(value);
      return _.isNaN(parsedDate) ? defaultValue :
        (next? new Date(parsedDate).setHours(24,0,0,0) : new Date(parsedDate).setHours(0,0,0,0));
    } else {
      return defaultValue;
    }
  }

  static getAPIResponse(status, message) {
    return {
      status,
      message
    }
  }
}

module.exports = Common;
