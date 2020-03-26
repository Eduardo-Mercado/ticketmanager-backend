const _ticketRepository = require('./ticket.repository');
const dbContext = require('../../data_base/dbContext');

module.exports = function (router) {
    const ticketRepository = _ticketRepository(dbContext);
router.route('/ticket')
        .get(ticketRepository.getAll)
        .post(ticketRepository.post);
         
router.route('/ticket/:ticketId')
        .get(ticketRepository.get)
        .put(ticketRepository.put)
        .delete(ticketRepository.delete);
router.route('/ticket/byAgent/:agentId')
        .get(ticketRepository.getTicketAgent);
}