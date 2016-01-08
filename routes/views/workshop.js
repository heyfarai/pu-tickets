var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'workshop';
	locals.filters = {
		workshop: req.params.workshop
	};
	locals.data = {
		workshop: []
	};
	
	// Load the current post
	view.on('init', function(next) {
		var q = keystone.list('Workshop').model.findOne({
			state: 'published',
			slug: locals.filters.workshop
		});
		
		q.exec(function(err, result) {
			locals.data.workshop = result;
			next(err);
		});
		
	});
	
	// Load other posts
	view.on('init', function(next) {
		
		var q = keystone.list('Workshop').model.find().where('state', 'published').sort('eventDate').limit('3');
		
		q.exec(function(err, results) {
			locals.data.moreWorkshops = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('workshop');
	
};
