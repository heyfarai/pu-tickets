var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Workshop = new keystone.List('Workshop', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Workshop.relationship({ path: 'events', ref: 'WorkshopEvent', refPath: 'workshop' });

Workshop.add({
	title: { type: String, required: true, index: true },
	expert: { type: Types.Relationship, ref: 'Expert', filters: { isActive: 'true' } },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft' },
	level: { type: Types.Select, options: 'beginner, advanced', default: 'beginner' },
	price: { type: Types.Money, format: 'R 0,0.00' },
	content: {
		shortDescription: { type: Types.Markdown, height: 50 },
		longDescription: { type: Types.Markdown, height: 100 },
		summary: { type: Types.Markdown, height: 150 },
		agendaMorning: { type: Types.Markdown, height: 180 },
		agendaAfternoon: { type: Types.Markdown, height: 180 },
		prerequisites: { type: Types.Markdown, height: 180 },
		audience: { type: Types.Markdown, height: 180 },
		takeaways: { type: Types.Markdown, height: 180 }
	},
});


Workshop.schema.virtual('content.full').get(function() {
	return this.content.longDescription || this.content.shortDescription;
});

Workshop.defaultColumns = 'title, expert, state';
Workshop.register();
