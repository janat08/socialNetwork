import OwnersSchema from './schema.js';

const Owners = new Mongo.Collection('owners');
export default Owners;

Owners.attachSchema(OwnersSchema);

Owners.allow({
    insert: () => true,
    update: () => true,
    remove: () => true
});

Owners.deny({
    insert: () => false,
    update: () => false,
    remove: () => false
}); 