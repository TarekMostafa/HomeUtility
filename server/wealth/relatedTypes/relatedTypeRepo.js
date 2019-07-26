const RelatedTypeModel = require('./relatedTypeModel');

class RelatedTypeRepo {
  static async getRelatedTypes() {
    return await RelatedTypeModel.findAll({});
  }
}

module.exports = RelatedTypeRepo;
