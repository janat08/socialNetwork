import FriendSchema from './schema.js';

const Friend = new Mongo.Collection('friendRequest');
export default Friend;

Friend.attachSchema(FriendSchema);

Friend.allow({
    insert: () => true,
    update: () => true,
    remove: () => true
});

Friend.deny({
    insert: () => false,
    update: () => false,
    remove: () => false
});