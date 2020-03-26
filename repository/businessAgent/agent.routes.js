const _agentRepository = require('./agent.repository');
const dbContext = require('../../data_base/dbContext');

module.exports = function (router) {
    const agentRepository = _agentRepository(dbContext);
router.route('/businessAgent')
        .get(agentRepository.getAll)
        .post(agentRepository.post);
         
//router.use('/company/:companyId', companyRepository.intercept);
router.route('/businessAgent/:agentId')
        .get(agentRepository.get)
        .put(agentRepository.put)
        .delete(agentRepository.delete);
}