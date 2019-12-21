import { Posts, Users, Friends } from '../cols.js'

Meteor.methods({
    "posts.insert" ({ friendIds, authorId, ...rest }) {
        const postId = Posts.insert({ authorId, ...rest })
        console.log(friendIds)
        friendIds.map(x => {
            const friend = Friends.findOne(x)
            if (friend.owner == this.userId || !this.connection) {
                const user = Users.findOne(friend.target)._id
                return Meteor.call('owners.insert', { ownerId: user, postId })
            }
        })
    }
})
