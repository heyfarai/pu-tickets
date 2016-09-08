var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var q = keystone.list('Person').model.find()
	.where('isPublished', 'true')
	.where('isOrganiser', 'true')

	q.exec(function(err, result) {
		var staff = result;
    	// Render the view
        return res.apiResponse(staff);
	});
};
