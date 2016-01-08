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

Workshop.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	level: { type: Types.Select, options: 'beginner, advanced', default: 'beginner', index: true },
	eventDate: { type: Types.Date, index: true },
	content: {
		brief: { type: Types.Markdown, height: 150 },
		extended: { type: Types.Markdown, height: 400 },
		prerequisites: { type: Types.Markdown, height: 180 },
		audience: { type: Types.Markdown, height: 180 },
		takeaways: { type: Types.Markdown, height: 180 },
		morning: { type: Types.Markdown, height: 180 },
		afternoon: { type: Types.Markdown, height: 180 }
	}
});

Workshop.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Workshop.defaultColumns = 'title, eventDate|20%';
Workshop.register();
