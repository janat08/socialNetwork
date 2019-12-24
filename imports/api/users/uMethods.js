import { Users, ImagesFiles } from '../cols.js'
Meteor.methods({
    "users.updateProfile" ({ first, last, avatar, background, ...rest }) {
        Users.update(this.userId, { $set: { profile: { first, last, avatar, background }, ...rest } })
        if (avatar) {
            ImagesFiles.update(avatar, { $set: { "meta.userId": this.userId } })
        }
        if (background) {
            ImagesFiles.update(background, { $set: { "meta.backgroundUserId": this.userId } })
        }
    }
})
