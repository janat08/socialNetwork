import EventsSchema from './schema.js';

const Events = new Mongo.Collection('events');
export default Events;

Events.attachSchema(EventsSchema);
