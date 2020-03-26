const _companyRepository = require('./company.repository');
const dbContext = require('../../data_base/dbContext');

module.exports = function (router) {
    const companyRepository = _companyRepository(dbContext);
router.route('/company')
        .get(companyRepository.getAll)
        .post(companyRepository.post);
         
//router.use('/company/:companyId', companyRepository.intercept);
router.route('/company/:companyId')
        .get(companyRepository.get)
        .put(companyRepository.put)
        .delete(companyRepository.delete);
}