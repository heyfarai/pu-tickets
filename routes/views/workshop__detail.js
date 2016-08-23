var keystone = require('keystone');
var _ = require('underscore');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'workshops';
	locals.filters = {
		workshop: req.params.workshop
	};
	locals.data = {
		workshop: false
	};

	// Load the current post
	view.on('init', function(next) {
		var q = keystone.list('ScheduleItem').model.findOne({
			slug: (locals.filters.workshop == "ux-launchpad") ? "ux-launchpad-design-play" : locals.filters.workshop,
		})
		.populate('speakers');

		q.exec(function(err, result) {
			locals.data.workshop = result;
			next(err);
		});

	});

	// Load other workshops
	view.on('init', function(next) {

		var q = keystone.list('ScheduleItem').model.find()
		.where('type', 'workshop')
		.where('slug').ne(locals.filters.workshop)
		.populate('speakers');

		q.exec(function(err, results) {
			locals.data.other_workshops = results;
			next(err);
		});

	});
	// Render the view
	view.render('workshop__detail');

};
