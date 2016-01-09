var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Speaker = new keystone.List('Speaker', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true }
});

Speaker.add({
	firstName: { type: String, initial: false, required: true },
	lastName: { type: String, initial: false, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	content: {
		jobTitle: { type: Types.Markdown, height: 150 },
		tagline: { type: Types.Markdown, height: 2 },
		shortDesc: { type: Types.Markdown, height: 40 },
		longDesc: { type: Types.Markdown, height: 180 }
	}
});

Speaker.schema.virtual('name').get(function() {
	return this.firstName + " " + this.lastName;
});

Speaker.defaultColumns = 'name';
Speaker.register();
