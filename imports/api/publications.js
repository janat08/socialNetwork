import {Posts, Users, Owners, FriendRequests, ImagesCollection } from './cols.js'

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
Meteor.publish('images.all', function(){
    return ImagesCollection.find()
})