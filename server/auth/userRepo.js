const UserModel = require('./userModel');

class UserRepo {
  static async getUser(id) {
    return await UserModel.findByPk(id);
  }

  static async getUserByUserName(name) {
    return await UserModel.findOne({where: {userName: name}});
  }
}

module.exports = UserRepo;
