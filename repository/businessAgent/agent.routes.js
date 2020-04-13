const _agentRepository = require('./agent.repository');
const dbContext = require('../../data_base/dbContext'); 
const authCheck = require('../../shared/middlewares/authCheck')

module.exports = function (router) {

    const agentRepository = _agentRepository(dbContext);
router.route('/businessAgent')
        .get(authCheck.isAuth, agentRepository.getAll)
       .post(authCheck.isAuth, agentRepository.post);
//router.get('/businessAgent', authCheck, agentRepository.getAll);

//router.use('/company/:companyId', companyRepository.intercept);

router.route('/businessAgent/:agentId')
        .get(authCheck.isAuth, agentRepository.get)
        .put(authCheck.isAuth, agentRepository.put)
        .delete(authCheck.isAuth, agentRepository.delete);
}