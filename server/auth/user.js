const UserModel = require('./userModel');
const Authentication = require('./authentication');
const Common = require('../common/common');

class User {
  async authenticate({userName, password}) {
    // Check user in the database
    const user = await UserModel.findOne({where: {userName: userName}});
    if(user === null) {
      return Common.getAPIResponse(false, 'Invalid User Name or Password');
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
      return Common.getAPIResponse(false, 'Invalid User Name or Password');
    }
    // Check user status
    if(!user.userActive) {
      return Common.getAPIResponse(false, `User (${user.userName}) is inactive`);
    } else {
      return Common.getAPIResponse(true, `authenticated`);
    }
  }
}

module.exports = User;
