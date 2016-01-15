var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	isActive: { type: Boolean, index: true }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Relationships
 */

User.relationship({ ref: 'Post', path: 'author' });


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();

/**
 * EXPERTS
 */

var Expert = new keystone.List('Expert', {
	inherits: User,
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name' }
});

Expert.relationship({ path: 'workshops', ref: 'Workshop', refPath: 'speaker' });

Expert.add('About the Expert', {
	twitter: { type: String },
	website: { type: Types.Url },
	mugshot: { type: Types.CloudinaryImage },
	content: {
		jobTitle: { type: Types.Markdown, height: 150 },
		tagline: { type: Types.Markdown, height: 2 },
		shortDesc: { type: Types.Markdown, height: 40 },
		longDesc: { type: Types.Markdown, height: 180 }
	}
});

// Provide access to Keystone
User.schema.virtual('workshop-count').get(function() {
	return this.workshops;
});

Expert.defaultColumns = 'name, email, isActive';


Expert.register();
