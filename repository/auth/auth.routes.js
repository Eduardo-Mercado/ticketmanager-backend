const _authRepository = require('./auth.repository');
const dbContext = require('../../data_base/dbContext');

module.exports = function (router) {
    const authRepository = _authRepository(dbContext);

    router.route('/auth/signIn').get(authRepository.getToken)

    router.route('/auth/').get(authRepository.get)
}