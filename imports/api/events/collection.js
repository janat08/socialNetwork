import EventsSchema from './schema.js';

const Events = new Mongo.Collection('events');
const Instances = new Mongo.Collection('instances')

export {Instances, Events}
Events.attachSchema(EventsSchema);
