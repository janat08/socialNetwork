import { Posts, Users, Friends } from '../cols.js'

Meteor.methods({
    "posts.insert" ({ friendIds, authorId, type = 'friends', ...rest }) {
        if (this.connection) {
            authorId = this.userId
        }
        const postId = Posts.insert({ authorId, ...rest })
        const ids = Users.findOne(authorId).friends.map(x => x.targetId)
        friendIds.filter(x => {
            return ids.indexOf(x) == -1 ? false : true
        }).map(x => {
            const user = Users.findOne(x)._id
            return Meteor.call('owners.insert', { ownerId: user, postId, authorId })
        })
    },
})
