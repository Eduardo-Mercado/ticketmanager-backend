const _agentRepository = require('./agent.repository');
const dbContext = require('../../data_base/dbContext');
const jwt = require('jsonwebtoken');
const authCheck = require('../../shared/middlewares/authCheck')

module.exports = function (router) {

        

    const agentRepository = _agentRepository(dbContext);
router.route('/businessAgent',authCheck)
        .get(agentRepository.getAll)
        .post(agentRepository.post);
         
//router.use('/company/:companyId', companyRepository.intercept);
router.route('/businessAgent/:agentId',authCheck)
        .get(agentRepository.get)
        .put(agentRepository.put)
        .delete(agentRepository.delete);
}