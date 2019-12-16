import {friendRequests} from '../cols.js'

Meteor.methods({
    "friendRequests.request"({requestee}){
        Meteor.user()
    }
})