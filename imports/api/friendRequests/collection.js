import FriendRequestsSchema from './schema.js';

const FriendRequests = new Mongo.Collection('friendRequest');
export default FriendRequests;

FriendRequests.attachSchema(FriendRequestsSchema);
