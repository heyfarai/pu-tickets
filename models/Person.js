var createHash = require('create-hash');
var keystone = require('keystone');
var bindLastModified = require('../lib/bindLastModified');
var Types = keystone.Field.Types;

/**
 * Person Model
 * ==============
 */

var Person = new keystone.List('Person', {
	autokey: { path: 'slug', from: 'name', unique: true }
});

Person.add({
	name: { type: Types.Name, required: true, initial: true, index: true },
	email: { type: Types.Email, initial: true, index: true },
	mugshot: { type: Types.CloudinaryImage, publicID: 'slug', folder: 'people'  },
	imagePromo: { type: Types.CloudinaryImage, publicID: 'slug', folder: 'promos'  },
	company: { type: String },
	city: { type: String },
	jobTitle: { type: String },
	tagline: { type: String },
	website: { type: Types.Url, note: 'Full website URL, including http://' },
	isPublished: { type: Boolean, default: false, index: true },
	isOrganiser: { type: Boolean, default: false, index: true },
	isSpeaker: { type: Boolean, default: false, index: true },
	isPublic: { type: Boolean, default: false, index: true },

	// editable via API
	bio: { type: Types.Textarea },
	twitter: { type: String, size: 'small' },
	content: {
		bio: { type: Types.Markdown, height: 40 },
		ourDesc: { type: Types.Markdown, height: 40 },
		shortDesc: { type: Types.Markdown, height: 40 },
	},

	// used in authentication
	ticketCode: { type: String, size: 'small', index: true },
	activatedOn: { type: Types.Datetime },
	authHash: { type: String, default: '', index: true },

	sortPriority: { type: Number, size: 'small', default: 10 }
});

/**
 * Relationships
 */

Person.relationship({ ref: 'Post', path: 'author' });
Person.relationship({ path: 'scheduleItems', ref: 'ScheduleItem', refPath: 'speakers' });

Person.schema.index({ isPublic: 1, isOrganiser: 1, isSpeaker: 1, sortPriority: 1 });

Person.schema.virtual('initials').get(function() {
	names = this.name.split(" ", 2)
	initials = names[0].substring(0,1) + names[1].substring(0,1)
	return initials;
});

bindLastModified(Person, 'people');

Person.schema.virtual('getJobTitleFull').get(function() {
	return this.jobTitle + ((this.company) ? " at " + this.company : "");
});

Person.schema.set('toJSON', { transform: function (doc, rtn) {
	return {
		slug: doc.slug,
		name: doc.name.full,
		jobTitle: doc.jobTitle || undefined,
		tagline: doc.tagline || undefined,
		mugshot: doc.mugshot.secure_url || doc.gravatar,
		twitter: doc.twitter || undefined,
		website: doc.website || undefined,
		company: doc.company || undefined,
		city: doc.city || undefined
	}
}});



/**
 * Registration
 */

Person.defaultColumns = 'name, twitter, ticketCode, activatedOn, isSpeaker';
Person.register()
