import { Posts, Users, Friends } from '../cols.js'

Meteor.methods({
    "posts.insert" ({ friendIds, authorId, ...rest }) {
        if (this.connection){
            authorId = this.userId
        }
        const postId = Posts.insert({ authorId, ...rest })
        friendIds.map(x => {
            const friend = Friends.findOne(x)
            if (friend.owner == this.userId || !this.connection) {
                const user = Users.findOne(friend.target)._id
                return Meteor.call('owners.insert', { ownerId: user, postId })
            }
        })
    }
})
