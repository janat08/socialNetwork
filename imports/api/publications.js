import {Places, Instances, Tickets, Posts, Users, Owners, FriendRequests, ImagesCollection, Events, Categories } from './cols.js'

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

Meteor.publish('categories.all', function(){
    return Categories.find()
})

Meteor.publish('events.all', function(){
    return Events.find()
})

Meteor.publish('instances.all', function(){
    return Instances.find()
})

Meteor.publish('tickets.all', function(){
    return Tickets.find()
})
Meteor.publish('places.all', function(){
    return Places.find()
})