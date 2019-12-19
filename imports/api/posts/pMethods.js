import { Posts, Users, Friends } from '../cols.js'

Meteor.methods({
    "posts.insert" ({ ownerIds, authorId, ...rest }) {
        const postId = Posts.insert({authorId, ...rest })
        // console.log(ownerIds)
        ownerIds.map(x => {
            console.log(Friends.findOne(x))
            const friend = Users.findOne(Friends.findOne(x).target)._id
            return Meteor.call('owners.insert', { ownerId: friend, postId })
        })
    }
})
