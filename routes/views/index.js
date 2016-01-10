var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	locals.data = {
		events: []
	};

	// Load other posts
	view.on('init', function(next) {
		
		var q = keystone.list('WorkshopEvent').model.find()
		.where('state', 'published')
		.populate('workshop')
		.sort('startDate');
		
		q.exec(function(err, results) {
			locals.data.events = results;
			next(err);
		});
		
	});

	// Render the view
	view.render('index');
	
};
