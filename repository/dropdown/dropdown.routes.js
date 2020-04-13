const _dropdownRepository = require('./dropdown.repository');
const dbContext = require('../../data_base/dbContext');
const authCheck = require('../../shared/middlewares/authCheck')

module.exports = function (router) {
    const dropdownRepository = _dropdownRepository(dbContext);
 
router.route('/dropdown/:table')
        .get(authCheck.isAuth, dropdownRepository.get);

router.route('/dropdown/:table/:id')
        .get(authCheck.isAuth, dropdownRepository.getFilter);
}