var keystone = require('keystone');
var _ = require('underscore');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'speaker-detail';
	locals.filters = {
		speaker: req.params.speaker
	};
	locals.data = {
		workshop: false,
		talk: false
	};

	// Load the current post
	view.on('init', function(next) {
		var q = keystone.list('Person').model.findOne({
			slug: (locals.filters.speaker == "rebecca-bortman-garza") ? "rebecca-garza-bortman" : locals.filters.speaker,
		});

		q.exec(function(err, result) {
			locals.data.speaker = result;
			next(err);
		});

	});

	// Load talks and workshops
	view.on('init', function(next) {
		keystone.list('ScheduleItem').model.find()
		.where('speakers', locals.data.speaker.id)
		.where('isPublished', 'true')
		.exec(function(err, scheduleItems) {
		    _.each(scheduleItems, function (s) {
		    	if(s.type=="talk") {
					locals.data.talk = s
				} else {
					locals.data.workshop = s
				}
		    })
			next(err);
		});
	});

	// Load other speakers
	view.on('init', function(next) {

		var q = keystone.list('Person').model.find()
		.where('isSpeaker', 'true')
		.where('slug').ne(locals.filters.speaker)
		.limit('4')
		.populate('speakers');

		q.exec(function(err, results) {
			locals.data.other_speakers = results;
			next(err);
		});

	});

	// Render the view
	view.render('speaker__detail');

};
