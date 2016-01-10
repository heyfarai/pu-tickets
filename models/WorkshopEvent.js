var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var WorkshopEvent = new keystone.List('WorkshopEvent', {
	map: { name: 'workshop' },
	autokey: { path: 'slug', from: 'workshop', unique: true }
});

WorkshopEvent.add({
	title: { type: String, noedit: true, hidden: true },
	workshop: { type: Types.Relationship, ref: 'Workshop', index: true },
	startDate: { type: Types.Date, format: 'Do MMM YYYY' },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
});

WorkshopEvent.defaultColumns = 'startDate|20%, title, state';

// METHODS
WorkshopEvent.schema.pre('save', function(next) {
	var e = this;
	var workshop = false;
	var expert = false;
	if(e.workshop){
		var q = keystone.list('Workshop').model.findOne({
			_id: this.workshop
		})
		.populate('expert')
		.exec()
		.then(function (workshop) {
			workshop = workshop ;
	    	keystone.list('Expert').model.findOne({
				_id: workshop.expert
			})
			.exec(function(r, po){
				expert = po
			})
			.then(function(){
	    		e.title = workshop.title + ' - ' + expert.name.full;
				next()
			})
		})
	}
});

WorkshopEvent.register();
