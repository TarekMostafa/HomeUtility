const AppParametersModel = require('./appParametersModel');

let loadedParameters = {};

class AppParametersRepo {
  static async getParameter(paramName) {
    return await AppParametersModel.findByPk(paramName);
  }

  static async getAppParameterValue(paramName, force) {
    if(loadedParameters.hasOwnProperty(paramName) && !force){
      return loadedParameters[paramName];
    } else {
      const appParam = await AppParametersModel.findByPk(paramName);
      if(!appParam) return null;
      else {
        //console.log(`The parameter ${paramName} has been loaded`);
        loadedParameters[paramName] = appParam.paramValue;
        return loadedParameters[paramName];
      }
    }
  }

  static async getParameters(params) {
    return await AppParametersModel.findAll({
      where: {
        paramName: params
      }
    })
  }
}

module.exports = AppParametersRepo;
