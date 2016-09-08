var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'dashboard';

	locals.data = {
		attendees: [],
		stats: {},
		tickets_workshop: 0,
		tickets_1day: 0,
		tickets_2day: 0,
		tickets_3day: 0,
		TBC_workshop: 0,
		TBC_masterclass: 0
	};

	// Load the current post
	view.on('init', function(next) {
		var q = keystone.list('Person').model.find()
		.where('isSpeaker', 'false')
		.where('isOrganiser', 'false')
		.sort('name')
		.populate('ticketType')
		.populate('ticketWorkshop')

		q.exec(function(err, result) {
			locals.data.attendees = result;

			for(i in locals.data.attendees){
				a = locals.data.attendees[i];

				// Count TBC Workshops
				if(a.hasWorkshop && !a.ticketWorkshop){
					locals.data.TBC_workshop++
				}

				// Count TBC Workshops
				if(a.hasWorkshop && a.ticketType.code=="1W"){
					locals.data.tickets_workshop++
				}

				// Count TBC Workshops
				if(a.ticketType && (a.ticketType.code=="1M" || a.ticketType.code=="1T")){
					locals.data.tickets_1day++
				}

				// Count TBC Workshops
				if(a.ticketType.code=="2D"){
					locals.data.tickets_2day++
				}

				// Count TBC Workshops
				if(a.ticketType.code=="3D"){
					locals.data.tickets_3day++
				}

				// Count TBC Masterclasses
				if(!a.ticketMasterclass && !a.isActivated){
					locals.data.TBC_masterclass++
				}
			}

			next(err);
		});

	});

	// WORD


	// Monday ticket
	view.on('init', function(next) {
		keystone.list('Ticket').model.findOne()
		.where('code', '1M')
		.exec(function(err, result) {
			locals.data.monday = result;
			next(err);
		});
	});

	// Monday attendees
	view.on('init', function(next) {
        keystone.list('Person').model.count()
		.where('ticketType').in([locals.data.monday])
		.exec(function(err, count){
        	locals.data.stats.monday = count;
        	next(err);
    	});
	})

	// Tuesday ticket
	view.on('init', function(next) {
		keystone.list('Ticket').model.findOne()
		.where('code', '1T')
		.exec(function(err, result) {
			locals.data.tuesday = result;
			next(err);
		});
	});

	// Tuesday attendees
	view.on('init', function(next) {
        keystone.list('Person').model.count()
		.where('ticketType').in([locals.data.tuesday])
		.exec(function(err, count){
        	locals.data.stats.tuesday = count;
        	next(err);
    	});
	})

	// 2 day ticket
	view.on('init', function(next) {
		keystone.list('Ticket').model.findOne()
		.where('code', '2D')
		.exec(function(err, result) {
			locals.data.twoday = result;
			next(err);
		});
	});

	// 2 Day attendees
	view.on('init', function(next) {
        keystone.list('Person').model.count()
		.where('ticketType').in([locals.data.twoday])
		.exec(function(err, count){
        	locals.data.stats.twoday = count;
        	next(err);
    	});
	})

	// 3 day ticket
	view.on('init', function(next) {
		keystone.list('Ticket').model.findOne()
		.where('code', '3D')
		.exec(function(err, result) {
			locals.data.threeday = result;
			next(err);
		});
	});

	// 3 Day attendees
	view.on('init', function(next) {
        keystone.list('Person').model.count()
		.where('ticketType').in([locals.data.threeday])
		.exec(function(err, count){
        	locals.data.stats.threeday = count;
        	next(err);
    	});
	})

	// UXL ticket
	view.on('init', function(next) {
		keystone.list('ScheduleItem').model.findOne()
		.where('code', 'UXL')
		.exec(function(err, result) {
			locals.data.uxl = result;
			next(err);
		});
	});

	// UXL Workshop attendees
	view.on('init', function(next) {
        keystone.list('Person').model.count()
		.where('ticketWorkshop').in([locals.data.uxl])
		.exec(function(err, count){
        	locals.data.stats.uxl = count;
        	next(err);
    	});
	})

	view.on('init', function(next) {
		keystone.list('ScheduleItem').model.findOne()
		.where('code', 'RWD')
		.exec(function(err, result) {
			locals.data.rwd = result;
			next(err);
		});
	});

	// Count Brad Workshop attendees
	view.on('init', function(next) {
        keystone.list('Person').model.count()
		.where('ticketWorkshop').in([locals.data.rwd])
		.exec(function(err, count){
        	locals.data.stats.rwd = count;
        	next(err);
    	});
	})

	// Count Masterclass attendees
	view.on('init', function(next) {
        keystone.list('Person').model.count()
		.where('ticketMasterclass', true)
		.exec(function(err, count){
        	locals.data.stats.masterclass = count;
        	next(err);
    	});
	})

	// Render the view
	view.render('dashboard');

};
