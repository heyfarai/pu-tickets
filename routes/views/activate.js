var keystone = require('keystone');
var Person = keystone.list('Person');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;

	locals.section = 'activate';
	locals.filters = {
		pID: req.params.p
	};
	locals.data = {
        person: false
	};

    view.on('init', function(next) {
        var q = keystone.list('Person').model
        .findOne({
			_id: locals.filters.pID,
		})
        .populate('ticketType')

		q.exec(function(err, result) {
			locals.data.person = result;
			next(err);
		});
	});

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


    // On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'activate' }, function(next) {

		updater = locals.data.person.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, twitter, company, ticketWorkshop, ticketMasterclass, isActivated',
			errorMessage: 'There was a problem submitting your enquiry:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
                console.log(err)
			} else {
				locals.enquirySubmitted = true;
                console.log('updated')
                return res.redirect('/get-ready/'+locals.filters.pID);
			}
			next();
		});
    })

	// Render the view
	view.render('activate');

};
