const _fileLoadRepository = require('./fileLoad.repository');
const dbContext = require('../../data_base/dbContext');

module.exports = function (router) {
    const fileRepository = _fileLoadRepository(dbContext);
router.route('/file')
        .post(fileRepository.post);

router.route('/file/:ticketId')
        .get(fileRepository.get)
}