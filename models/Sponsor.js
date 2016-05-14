var keystone = require('keystone');
var bindLastModified = require('../lib/bindLastModified');
var modelToJSON = require('../lib/modelToJSON');
var Types = keystone.Field.Types;

/**
 * ScheduleItem Model
 * ==================
 */

var Sponsor = new keystone.List('Sponsor', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true }
});

Sponsor.add({
	name: { type: String, required: true, index: true },
	type: { type: Types.Relationship, ref: 'SponsorType', many: false },
	website: { type: Types.Url, note: 'Full website URL, including http://' },
    tagline: { type: String, required: false, index: true },
	logo: { type: Types.CloudinaryImage, publicID: 'slug', folder: 'sponsor'  },
	description: { type: Types.Markdown },
	isPublished: { type: Boolean, default: false, index: true },
});

modelToJSON(Sponsor, function (doc, rtn) {
	rtn.description = doc.name;
});

bindLastModified(Sponsor, 'sponsor');

Sponsor.defaultSort = 'name';
Sponsor.defaultColumns = 'name, type,isPublished';
Sponsor.register();
