//const APIResponse = require('../../utilities/apiResponse');
const RelatedTypeRepo = require('./relatedTypeRepo');

class RelatedType {

  async getRelatedTypes() {
    let relatedTypes = await RelatedTypeRepo.getRelatedTypes();
    relatedTypes = relatedTypes.map( type => {
      return {
        typeCode: type.typeCode,
        typeDescription: type.typeDescription,
      }
    });
    return relatedTypes;
  }
}

module.exports = RelatedType;
