import FriendsSchema from './schema.js';

const Friends = new Mongo.Collection('friends');
export default Friends;

Friends.attachSchema(FriendsSchema);

Friends.allow({
    insert: () => true,
    update: () => true,
    remove: () => true
});

Friends.deny({
    insert: () => false,
    update: () => false,
    remove: () => false
});