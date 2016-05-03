var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'workshops';

	locals.data = {
		workshops: []
	};

	// Load the current post
	view.on('init', function(next) {
		var q = keystone.list('ScheduleItem').model.find({
			isPublished: true,
			type : 'workshop',
		}).populate('speakers');

		q.exec(function(err, result) {
			locals.data.workshops = result;
			next(err);
		});

	});

	// Render the view
	view.render('workshops');

};
