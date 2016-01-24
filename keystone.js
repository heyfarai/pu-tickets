// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');
var cons = require('consolidate');
var nunjucks = require('nunjucks');
var mcapi = require('mailchimp-api');
// Require keystone
var keystone = require('keystone');


// set MailChimp API key here
mc = new mcapi.Mailchimp('ca1cacc38baa6dc43c6045085ca1e7d4-us12');
// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.
cons.requires.nunjucks = nunjucks.configure({ autoescape: false });

keystone.init({

	'name': 'Pixel Up!',
	'brand': 'Pixel Up!',

	'less': 'public',

	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'html',
	'custom engine': cons.nunjucks,

	'emails': 'templates/emails',

	'auto update': true,
	'session': true,
	'session store': 'mongo',
	'auth': true,
	'user model': 'User'

});

// Load your project's Models

keystone.import('models');

// Your cookie secret is used to secure session cookies. This environment
// variable was added to your Heroku config for you if you used the "Deploy to
// Heroku" button. The secret below will be used for development.
// You may want to set it to something private and secure.

if (!keystone.get('cookie secret')) {
	keystone.set('cookie secret', '----change-me-to-something-secret----');
}


// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
	is_prelaunch: process.env.is_prelaunch,
	newsletter_id: process.env.NEWSLETTER_ID
});

keystone.set('auto update', true);

// Load your project's Routes

keystone.set('routes', require('./routes'));

// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.

// You should ensure you have the EMAIL_HOSTNAME environment variable set on
// your production / staging servers, or images and links in your emails will
// default to http://localhost:3000.

var email_hostname = process.env.EMAIL_HOSTNAME || 'localhost:3000';

keystone.set('email locals', {
	server: 'http://' + email_hostname,
	logo_src: 'http://' + email_hostname + '/images/logo-email.gif',
	logo_width: 194,
	logo_height: 76,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de',
		buttons: {
			color: '#fff',
			background_color: '#2697de',
			border_color: '#1a7cb7'
		}
	}
});

// Load your project's email test routes

keystone.set('email tests', require('./routes/emails'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	'events': 'workshop-events',
	'workshops': 'workshops',
	'experts': 'experts',
	'blog': ['posts', 'post-categories'],
	//'galleries': 'galleries',
	//'enquiries': 'enquiries',
	'users': 'users'
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();
