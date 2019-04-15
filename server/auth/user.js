const UserModel = require('./userModel');
const Authentication = require('./authentication');
const APIResponse = require('../utilities/apiResponse');

class User {
  async authenticate({userName, password}) {
    // Check user in the database
    const user = await UserModel.findOne({where: {userName: userName}});
    if(user === null) {
      return APIResponse.getAPIResponse(false, null, '003');
    }
    // Compare password with the one stored in the database
    const encryptedPass = await Authentication.encrypt(password);
    if(encryptedPass !== user.userPassword) {
      //Increment user attempt
      user.userAttempt += 1;
      // if user attempt more than or equal 3, deactivate user
      if(user.userAttempt >= 3) {
        user.userActive = false;
      }
      await user.save();
      return APIResponse.getAPIResponse(false, null, '003');
    }
    // Check user status
    if(!user.userActive) {
      return APIResponse.getAPIResponse(false, null, '004', user.userName);
    } else {
      return APIResponse.getAPIResponse(true, {userId:user.userId, userName: user.userName});
    }
  }
}

module.exports = User;
