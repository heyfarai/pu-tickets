var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var q = keystone.list('ScheduleItem').model.find()
	.populate('speakers')
	.sort('startTime')

	q.exec(function(err, result) {
		var sessions = result;
    	// Render the view
        return res.apiResponse(sessions);
	});
};
