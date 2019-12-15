import CommentSchema from './schema.js';

const FriendRequest = new Mongo.Collection('friendRequest');
export default FriendRequest;

FriendRequest.attachSchema(FriendRequestSchema);

FriendRequest.allow({
    insert: () => true,
    update: () => true,
    remove: () => true
});

FriendRequest.deny({
    insert: () => false,
    update: () => false,
    remove: () => false
});