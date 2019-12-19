import {Friends, Posts, Users, Owners, FriendRequests } from './cols.js'

Meteor.publish('friends.all', function(){
    return Friends.find()
})
Meteor.publish('posts.all', function(){
    return Posts.find()
})
Meteor.publish('users.all', function(){
    return Users.find({}, {services: -1})
})
Meteor.publish('owners.all', function(){
    return Owners.find()
})
Meteor.publish('friendRequests.all', function(){
    return FriendRequests.find()
})