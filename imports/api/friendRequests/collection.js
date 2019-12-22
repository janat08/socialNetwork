import FriendRequestsSchema from './schema.js';

const FriendFriendRequests = new Mongo.Collection('friendRequest');
export default FriendFriendRequests;

FriendFriendRequests.attachSchema(FriendRequestsSchema);
