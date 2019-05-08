const uuidv1 = require('uuid/v1');
const UserRepo = require('./userRepo');
const Authentication = require('./authentication');
const APIResponse = require('../utilities/apiResponse');

class User {
  async authenticate({userName, password}) {
    // Check user in the database
    const user = await UserRepo.getUserByUserName(userName);
    if(!user) {
      return APIResponse.getAPIResponse(false, null, '003');
    }
    // Check user is Active
    if(!user.userActive) {
      return APIResponse.getAPIResponse(false, null, '004', user.userName);
    }
    // Compare password with the one stored in the database
    const encryptedPass = await Authentication.encrypt(password);
    if(encryptedPass !== user.userPassword) {
      // if user attempt more than or equal 3, deactivate user
      if(user.userAttempt >= 3) {
        user.userActive = false;
      } else {
        //Increment user attempt
        user.userAttempt += 1;
      }
      await user.save();
      return APIResponse.getAPIResponse(false, null, '003');
    }
    user.userAttempt = 0;
    user.userToken = uuidv1();
    await user.save();
    return APIResponse.getAPIResponse(true, {
      userId:user.userId,
      userName: user.userName,
      userToken: user.userToken
    });
  }

  async tokenAuthentication({userToken}) {
    const user = await UserRepo.getUserByUserToken(userToken);
    if(!user) {
      return APIResponse.getAPIResponse(false, null, '003');
    } else {
      return APIResponse.getAPIResponse(true, {
        userId:user.userId,
        userName: user.userName,
        userToken: user.userToken
      });
    }
  }

  async logout({userId}) {
    // Check user in the database
    const user = await UserRepo.getUser(userId);
    if(!user) {
      return APIResponse.getAPIResponse(false, null, '003');
    }
    user.userToken = null;
    await user.save();
    return APIResponse.getAPIResponse(true, null, '045');
  }

  async changePassword({userId, oldPassword, newPassword}){
    // Check user in the database
    const user = await UserRepo.getUser(userId);
    if(!user) {
      return APIResponse.getAPIResponse(false, null, '003');
    }
    // Compare password with the one stored in the database
    const encryptedPass = await Authentication.encrypt(oldPassword);
    if(encryptedPass !== user.userPassword) {
      return APIResponse.getAPIResponse(false, null, '003');
    }
    // Encrypt new Password and store it
    const newEncryptedPass = await Authentication.encrypt(newPassword);
    user.userPassword = newEncryptedPass;
    await user.save();
    return APIResponse.getAPIResponse(true, null, '024');
  }

  async changeUserName({userId, userName}){
    // Check user in the database
    const user = await UserRepo.getUser(userId);
    if(!user) {
      return APIResponse.getAPIResponse(false, null, '003');
    }
    user.userName = userName;
    await user.save();
    return APIResponse.getAPIResponse(true, null, '042');
  }
}

module.exports = User;
