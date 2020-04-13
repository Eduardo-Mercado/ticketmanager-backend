const _customerRepository = require('./customer.repository');
const dbContext = require('../../data_base/dbContext');
const authCheck = require('../../shared/middlewares/authCheck')

module.exports = function (router) {
    const customerRepository = _customerRepository(dbContext);
router.route('/customer')
        .get(authCheck.isAuth, customerRepository.getAll)
        .post(authCheck.isAuth, customerRepository.post);
          
router.route('/customer/:customerId')
        .get(authCheck.isAuth, customerRepository.get)
        .put(authCheck.isAuth, customerRepository.put)
        .delete(authCheck.isAuth, customerRepository.delete);
}