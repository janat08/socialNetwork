import OwnersSchema from './schema.js';

const Owners = new Mongo.Collection('owners');
export default Owners;

Owners.attachSchema(OwnersSchema);
