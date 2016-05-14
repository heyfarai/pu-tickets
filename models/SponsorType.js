var keystone = require('keystone');

/**
 * SponsorType Model
 * ==================
 */

var SponsorType = new keystone.List('SponsorType', {
	autokey: { path: 'slug', from: 'name', unique: true }
});

SponsorType.add({
	name: { type: String, required: true }
});

SponsorType.relationship({ ref: 'Sponsor', path: 'type' });

SponsorType.register();
