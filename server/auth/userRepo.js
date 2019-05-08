const UserModel = require('./userModel');

class UserRepo {
  static async getUser(id) {
    return await UserModel.findByPk(id);
  }

  static async getUserByUserName(name) {
    return await UserModel.findOne({where: {userName: name}});
  }

  static async getUserByUserToken(userToken) {
    return await UserModel.findOne({where: {userToken: userToken}});
  }
}

module.exports = UserRepo;
