import FriendRequestsSchema from './schema.js';

const FriendFriendRequests = new Mongo.Collection('friendRequest');
export default FriendFriendRequests;

FriendFriendRequests.attachSchema(FriendRequestsSchema);

FriendFriendRequests.allow({
    insert: () => true,
    update: () => true,
    remove: () => true
});

FriendFriendRequests.deny({
    insert: () => false,
    update: () => false,
    remove: () => false
});