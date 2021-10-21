class Common {
  // static getNumber(value, defaultValue) {
  //   if(!_.isNil(value)) {
  //     return _.isNaN(_.toNumber(value)) ? defaultValue : _.toNumber(value);
  //   } else {
  //     return defaultValue;
  //   }
  // }

  // static getText(value, defaultValue) {
  //   if(!_.isNil(value)) {
  //     return value;
  //   } else {
  //     return defaultValue;
  //   }
  // }

  static getDate(value, defaultValue, next) {
    if(value) {
      const parsedDate = Date.parse(value);
      return Number.isNaN(parsedDate) ? defaultValue :
        (next? new Date(parsedDate).setHours(23,59,59) : new Date(parsedDate).setHours(0,0,0));
    } else {
      return defaultValue;
    }
  }
}

module.exports = Common;
