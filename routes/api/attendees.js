var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var q = keystone.list('Person').model.find()
	.where('isSpeaker', 'false')
	.where('isOrganiser', 'false')
	.where('isPublic', 'true')
	.where('isPublished', 'true')
	.sort('createdAt')

	q.exec(function(err, result) {
		var attendees = result;
    	// Render the view
        return res.apiResponse(attendees);
	});
};
