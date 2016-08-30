var keystone = require('keystone');
var bindLastModified = require('../lib/bindLastModified');
var modelToJSON = require('../lib/modelToJSON');
var Types = keystone.Field.Types;

/**
 * Ticket Model
 * ==================
 */

var Ticket = new keystone.List('Ticket', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true }
});

Ticket.add({
	name: { type: String, required: true, index: true },
	code: { type: String, index: true },
	hasWorkshop: { type: Boolean},
	hasMasterClass: { type: Boolean}
});

Ticket.relationship({ ref: 'Person', path: 'ticketType' });

bindLastModified(Ticket, 'schedule');

/**
 * Registration
 */

Ticket.defaultColumns = 'name, code, hasWorkshop, hasMasterClass';
Ticket.register();
