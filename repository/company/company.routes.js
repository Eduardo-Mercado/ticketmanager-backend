const _companyRepository = require('./company.repository');
const dbContext = require('../../data_base/dbContext');
const authCheck = require('../../shared/middlewares/authCheck')

module.exports = function (router) {
    const companyRepository = _companyRepository(dbContext);
router.route('/company')
        .get(authCheck.isAuth, companyRepository.getAll)
        .post(authCheck.isAuth, companyRepository.post);
         
//router.use('/company/:companyId', companyRepository.intercept);
router.route('/company/:companyId')
        .get(authCheck.isAuth, companyRepository.get)
        .put(authCheck.isAuth, companyRepository.put)
        .delete(authCheck.isAuth, companyRepository.delete);
}