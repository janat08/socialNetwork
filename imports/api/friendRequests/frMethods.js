import { FriendRequests } from '../cols.js'
import moment from 'moment'

Meteor.methods({
    "friendRequests.insert" (doc) {
        const { requester, requestee } = doc
        if (this.connection) {
            if (!this.userId) throw new Meteor.Error('logged out')
            if (this.userId != requester) throw new Meteor.Error('500')
            if (FriendRequests.findOne({ requester, requestee })) throw new Meteor.Error("You've already made friend request in past 30 days.")
        }
        doc.dateSent = new Date()
        doc.pending = true
        return FriendRequests.insert(doc)
    },
    'friendRequests.reject' ({ _id }) {
        FriendRequests.update({ _id, requestee: this.userId }, { $set: { reject: true, dateReplied: new Date() } }, (err, res) => {})
    },
    'friendRequests.block' ({ _id }) {
        FriendRequests.update({ _id, requestee: this.userId }, { $set: { block: true, dateReplied: new Date() } }, (err, res) => {})
    },
    'friendRequests.erase' ({ _id }) {
        FriendRequests.update({ _id, requestee: this.userId }, { $set: { erase: true, dateReplied: new Date() } }, (err, res) => {})
    },
    'friendRequests.accept' ({ _id, requestee, requester }) {
        FriendRequests.remove({ _id, requestee: this.userId })
        Meteor.call('friends.insert', { firstId: requester, requesteeId: requestee })
    },
})


SyncedCron.add({
    name: 'deleteFriendRequest',
    schedule: function(parser) {
        return parser.text('every day')
    },
    job: function() {
        FriendRequests.remove({block: {$exists: true, $nin: [true]}, dateReplied: {$lte: moment().subtract(1, 'months').date()}})
    }
});
