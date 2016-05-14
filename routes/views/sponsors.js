var keystone = require('keystone');
var async = require('async');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'sponsors';

	locals.data = {
		sponsors: {
			'Premier' 	:[],
			'Executive' : [],
			'Associate' : [],
			'Media' 	: [],
			'Other' 	: []
		}
	};

	// Load the current post
	view.on('init', function(next) {
		var q = keystone.list('Sponsor').model.find()
		.where('isPublished', 'true')
		.populate('type');

		q.exec(function(err, result) {
			var sponsorCache = result;
			// Load the counts for each category
			async.each(sponsorCache, function(sponsor, next) {
				locals.data.sponsors[sponsor.type.name].push(sponsor)
			}, function(err) {
				next(err);
			});

			next(err);
		});

	});

	// Render the view
	view.render('sponsors');

};
