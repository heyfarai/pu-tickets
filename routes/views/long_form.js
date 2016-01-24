var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'social';
	locals.filters = {
	};
	locals.data = {

	};


	// Render the view
	view.render('long_form');

};
