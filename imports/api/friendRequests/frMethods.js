import {FriendRequests} from '../cols.js'

Meteor.methods({
    "friendRequests.insert"(doc){
        FriendRequests.insert(doc)
    }
})