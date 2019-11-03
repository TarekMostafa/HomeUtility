const APIResponse = require('../../utilities/apiResponse');
const RelatedTypeRepo = require('./relatedTypeRepo');

class RelatedType {

  async getRelatedTypes() {
    const relatedTypes = await RelatedTypeRepo.getRelatedTypes();
    return APIResponse.getAPIResponse(true, relatedTypes);
  }
}

module.exports = RelatedType;
