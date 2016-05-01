/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('underscore');
var keystone = require('keystone');

/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/

exports.initLocals = function(req, res, next) {

	var locals = res.locals;
	locals.is_dev = (keystone.get('env')=="development") ? true : false;
	locals.user = req.user;
	next();

};

/**
    Inits the error handler functions into `res`
*/
exports.initErrorHandlers = function(req, res, next) {

    res.err = function(err, title, message) {
        res.status(500).render('errors/500', {
            err: err,
            errorTitle: title,
            errorMsg: message
        });
    }

    res.notfound = function(title, message) {
        res.status(404).render('errors/404', {
            errorTitle: title,
            errorMsg: message
        });
    }

    next();

};

/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {

	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};

	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false;

	next();

};

exports.forceSSL = function(req,res,next) {
	var sslUrl;
	// if we're in dev, add the port
	var sslPort = (keystone.get('env')=="development") ? ':' + keystone.get('ssl port') : "";
	// combine hostname and port
	var hostnameWithPort = req.hostname + sslPort

	if (
		(keystone.get('env')=="production" && req.headers['x-forwarded-proto'] !== 'https') ||
		(keystone.get('env')=="development" && !req.secure)
		) {
		sslUrl = ['https://', hostnameWithPort, req.url].join('');
		console.log(req.secure);
		return res.redirect(sslUrl);
	}
	next();
}

/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {

	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}

};
