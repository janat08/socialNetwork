import { Posts, Users, Friends } from '../cols.js'

Meteor.methods({
    "posts.insert" ({ friendId, authorId, ...rest }) {
        if (this.connection) {
            authorId = this.userId
        }
        const postId = Posts.insert({ authorId, ...rest })
        const ids = Users.findOne(authorId).friendIds

        var friendIds = [friendId]
        switch (friendId) {
            case "friends":
            case "colleagues":
            case "family":
            case "besties":
                friendIds = Friends.find({ owner: this.userId, type: friendId }, { _id: 1 }).fetch().map(x=>x._id)
        }

        friendIds.filter(x => {
            return ids.indexOf(x) == -1 ? false : true
        }).map(x => {
            const friend = Friends.findOne(x)
            if (friend.owner == this.userId || !this.connection) {
                const user = Users.findOne(friend.target)._id
                return Meteor.call('owners.insert', { ownerId: user, postId })
            }
        })
    },
})
