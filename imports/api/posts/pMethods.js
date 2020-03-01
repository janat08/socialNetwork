import { Posts, Users, Friends } from '../cols.js'

Meteor.methods({
    //you can message to type of friends by using friendIds = ['friends']
    "posts.insert" ({ friendIds, authorId, ...rest }) {
        if (this.connection) {
            authorId = this.userId
        }
        const user = Users.findOne(authorId)
        if (['family', 'besties', 'colleague', 'friends'].indexOf(friendIds[0]) != -1) {
            const u = user
            if (u && u.friends) {
                friendIds = u.friends.filter(x=>x.type==friendIds[0]).map(x => x.targetId)
            }
            else {
                throw new Meteor.Error('login or add friends first before posting')
            }
        }
        const postId = Posts.insert({ authorId, ...rest })
        const ids = user.friends.map(x => x.targetId)
        friendIds.filter(x => {
            return ids.indexOf(x) == -1 ? false : true
        }).map(x => {
            const user = Users.findOne(x)._id
            return Meteor.call('owners.insert', { ownerId: user, postId, authorId })
        })
    },
})
