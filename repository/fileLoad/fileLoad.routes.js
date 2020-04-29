const _fileLoadRepository = require('./fileLoad.repository');
const dbContext = require('../../data_base/dbContext');
const authCheck = require('../../shared/middlewares/authCheck');

module.exports = function (router) {
    const fileRepository = _fileLoadRepository(dbContext);

router.route('/file')
        .post(authCheck.isAuth,fileRepository.post);

router.route('/file/download/:id')
        .get(fileRepository.getFile);

router.route('/file/:ticketId')
        .get(authCheck.isAuth,fileRepository.get)
}