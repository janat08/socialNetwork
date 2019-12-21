import { Owners } from '../cols.js'

Meteor.methods({
    "owners.insert" ({ postId, ownerId }) {
        Owners.insert({ postId, ownerId, approved: false })
    },
    'owners.approve' (post) {
        if (!this.userId) throw new Meteor.Error('logged off')
        const { _id } = post
        Owners.update({ postId: _id, ownerId: this.userId }, {$set: {approved: true}})
    },
    'owners.reject' (post) {
        if (!this.userId) throw new Meteor.Error('logged off')
        const { _id } = post
        Owners.remove({ postId: _id, ownerId: this.userId })
    },
})
