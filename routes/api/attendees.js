var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var locals = res.locals;
	locals.filters = {
		aType: req.params.type
	};
	locals.data = {}
	var q = keystone.list('Person').model.find()
	.sort('name')
	.populate('ticketType')
	.populate('ticketWorkshop')

	q.exec(function(err, result) {
		locals.data.attendees = [];
		for(i in result){
			a = result[i];
			// Count 3 Day
			if(a.ticketType && a.ticketType.code==locals.filters.aType){
				locals.data.attendees.push(a)
			}
		}
        return res.apiResponse(locals.data.attendees);
	});
};
