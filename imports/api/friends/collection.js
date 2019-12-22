import FriendsSchema from './schema.js';

const Friends = new Mongo.Collection('friends');
export default Friends;

Friends.attachSchema(FriendsSchema);