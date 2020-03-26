const _dropdownRepository = require('./dropdown.repository');
const dbContext = require('../../data_base/dbContext');

module.exports = function (router) {
    const dropdownRepository = _dropdownRepository(dbContext);
 
router.route('/dropdown/:table')
        .get(dropdownRepository.get);

router.route('/dropdown/:table/:id')
        .get(dropdownRepository.getFilter);
}