var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var q = keystone.list('Person').model.find()
	.where('isPublished', 'true')
	.where('isSpeaker', 'true')
	.sort('sortPriority')

	q.exec(function(err, result) {
		var speakers = result;
    	// Render the view
        return res.apiResponse(speakers);
	});
};
