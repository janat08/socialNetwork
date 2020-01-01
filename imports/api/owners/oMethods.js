import { Owners, Users } from '../cols.js'

Meteor.methods({
    "owners.insert" ({ postId, ownerId, authorId }) {
        if (!Users.findOne(ownerId).friends.find(x => x.targetId == authorId).blocked) {
            Owners.insert({ postId, ownerId, approved: false })
        }
    },
    'owners.approve' (post) {
        if (!this.userId) throw new Meteor.Error('logged off')
        const { _id } = post
        Owners.update({ postId: _id, ownerId: this.userId }, { $set: { approved: true } })
    },
    'owners.reject' (post) {
        if (!this.userId) throw new Meteor.Error('logged off')
        console.log('rejecting')
        const { _id } = post
        Owners.remove({ postId: _id, ownerId: this.userId })
    },
})
