var keystone = require('keystone');
var bindLastModified = require('../lib/bindLastModified');
var modelToJSON = require('../lib/modelToJSON');
var Types = keystone.Field.Types;

/**
 * ScheduleItem Model
 * ==================
 */

var ScheduleItem = new keystone.List('ScheduleItem', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

ScheduleItem.add({
	title: { type: String, required: true, index: true },
	promoImg: { type: Types.CloudinaryImage, publicID: 'slug', folder: 'talk-workshop'  },
	type: { type: Types.Select, options: 'talk, break, lunch, workshop', index: true },
	startTime: { type: Types.Datetime, utc: true, index: true },
	endTime: { type: Types.Datetime, utc: true, index: true },
	duration: { type: Number, index: true }, // FIXME: could be determined from startTime/endTime
	isPublished: { type: Boolean, default: false, index: true },
	speakers: { type: Types.Relationship, ref: 'Person', many: true, filters: { isSpeaker: true, isPublished: true }, index: true },
	shortDescription: { type: Types.Markdown },
	description: { type: Types.Markdown }
});

modelToJSON(ScheduleItem, function (doc, rtn) {
	rtn.description = doc.description.html;
});

bindLastModified(ScheduleItem, 'schedule');

/**
 * Registration
 */

ScheduleItem.defaultSort = 'startTime';
ScheduleItem.defaultColumns = 'startTime, type, speakers, title, time';
ScheduleItem.register();
