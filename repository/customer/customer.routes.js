const _customerRepository = require('./customer.repository');
const dbContext = require('../../data_base/dbContext');

module.exports = function (router) {
    const customerRepository = _customerRepository(dbContext);
router.route('/customer')
        .get(customerRepository.getAll)
        .post(customerRepository.post);
          
router.route('/customer/:customerId')
        .get(customerRepository.get)
        .put(customerRepository.put)
        .delete(customerRepository.delete);
}