const _taskRepository = require('./task-repository');
const dbContext = require('../../data_base/dbContext');
const authCheck = require('../../shared/middlewares/authCheck');

module.exports = function (router) {
 const taskRepository = _taskRepository(dbContext);
 router.route('/task')
        .post(authCheck.isAuth, taskRepository.post);
}