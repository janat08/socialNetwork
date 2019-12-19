import {Owners} from '../cols.js'

Meteor.methods({
    "owners.insert"({postId, ownerId}){
        Owners.insert({postId, ownerId, approved: false})
    }
})