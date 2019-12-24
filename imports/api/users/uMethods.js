import {Users, ImagesFiles} from '../cols.js'
Meteor.methods({
    "users.updateProfile"({first, last, avatar, ...rest}){
        Users.update(this.userId, {$set: {profile: {first, last, avatar}, ...rest}})
        if (avatar){
            ImagesFiles.update(avatar, {$set: {"meta.userId": this.userId}})
        }
    }
})