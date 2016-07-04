var keystone = require('keystone');
var _ = require('underscore');
var moment = require('moment');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'schedule';

	locals.data = {
		scheduleItems: []
	};

	// Load the current post
	view.on('init', function(next) {
		var q = keystone.list('ScheduleItem').model.find()
		.populate('speakers')
		.sort('startTime')

		q.exec(function(err, result) {

			locals.data.scheduleItems = result;
			next(err);
		});

	});


	// Render the view
	view.render('schedule');

};
