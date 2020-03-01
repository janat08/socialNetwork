import EventsSchema from './schema.js';

const Events = new Mongo.Collection('events');
const Instances = new Mongo.Collection('instances')
const Tickets = new Mongo.Collection('tickets')
const Places = new Mongo.Collection('places')

export {Instances, Events, Tickets, Places}
// Events.attachSchema(EventsSchema);
