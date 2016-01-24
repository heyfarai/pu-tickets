var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'speakers';

	locals.data = {
		speakers: []
	};
	
	// Load the current post
	view.on('init', function(next) {
		var q = keystone.list('Person').model.find()
		.where('isPublished', 'true')
		.where('isSpeaker', 'true')
		.sort('sortPriority')
		
		q.exec(function(err, result) {
			locals.data.speakers = result;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('speakers');
	
};
