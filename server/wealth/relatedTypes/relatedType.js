const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const Common = require('../../utilities/common');
const APIResponse = require('../../utilities/apiResponse');
const RelatedTypeRepo = require('./relatedTypeRepo');

const Op = Sequelize.Op;

class RelatedType {

  async getRelatedTypes() {
    const relatedTypes = await RelatedTypeRepo.getRelatedTypes();
    return APIResponse.getAPIResponse(true, relatedTypes);
  }
}

module.exports = RelatedType;
