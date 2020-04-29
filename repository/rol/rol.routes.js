const _rolRepository = require('./rol.respository');
const dbContext = require('../../data_base/dbContext');

module.exports = function (router) {
    const rolRepository = _rolRepository(dbContext);

    router.route('/rol/options/:id').get(rolRepository.getOptions)
   
}