var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var q = keystone.list('Sponsor').model.find()
	.where('isPublished', 'true')
	.populate('type');

	q.exec(function(err, result) {
		var sponsors = result;
    	// Render the view
        return res.apiResponse(sponsors);
	});
};
