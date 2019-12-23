import {Users, ImagesFiles} from '../cols.js'
Meteor.methods({
    "users.updateProfile"(doc){
        Users.update(this.userId, {$set: {profile: doc}})
        if (doc.avatar){
            ImagesFiles.update(doc.avatar, {$set: {"meta.userId": this.userId}})
        }
    }
})