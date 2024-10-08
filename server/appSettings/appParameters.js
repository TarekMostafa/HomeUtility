const AppParametersRepo = require('./appParametersRepo');
//const APIResponse = require('../utilities/apiResponse');
const Exception = require('../features/exception');

class AppParameters {

  async getAppParameters(params) {
    const appParameters = await AppParametersRepo.getParameters(params);
    if(appParameters) {
      //return APIResponse.getAPIResponse(true, appParameters);
      return appParameters;
    } else {
      //return APIResponse.getAPIResponse(false, null, 'APP_PARAM_ERROR');
      throw new Exception('APP_PARAM_ERROR');
    }
  }

  async updateAppParameter({paramName, paramValue}) {
    let appParameter = await AppParametersRepo.getParameter(paramName)
    if(!appParameter) {
      //return APIResponse.getAPIResponse(false, null, 'APP_PARAM_ERROR');
      throw new Exception('APP_PARAM_ERROR');
    }
    appParameter.paramValue = paramValue;
    await appParameter.save();
    //return APIResponse.getAPIResponse(true, null, 'APP_PARAM_UPDATE');
  }
}

module.exports = AppParameters;
