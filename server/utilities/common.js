class Common {
  static getNumber(value, defaultValue) {
    if(isNaN(value)) {
      return defaultValue;
    } else {
      return Number(value);
    }
  }

  // static getText(value, defaultValue) {
  //   if(!_.isNil(value)) {
  //     return value;
  //   } else {
  //     return defaultValue;
  //   }
  // }

  static getDate(value, defaultValue) {
    if(value) {
      const parsedDate = Date.parse(value);
      return Number.isNaN(parsedDate) ? defaultValue :
       this.extractDateOnly(value);
    } else {
      return defaultValue;
    }
  }

  static extractDateOnly(dateTimeString) {
    // Extract date parts from the datetime string
    var parts = dateTimeString.split('T');    
    return parts[0];
  }
}

module.exports = Common;
