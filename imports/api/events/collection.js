import EventsSchema from './schema.js';

const Events = new Mongo.Collection('events');
const Instances = new Mongo.Collection('instances')
const Tickets = new Mongo.Collection('Tickets')

export {Instances, Events, Tickets}
Events.attachSchema(EventsSchema);
