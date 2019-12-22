import {Users} from '../cols.js'
Meteor.methods({
    "users.updateProfile"(doc){
        Users.update(this.userId, {$set: {profile: doc}})
    }
})

// {first,last,avatar}