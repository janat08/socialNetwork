import { FriendRequests } from '../cols.js'
import moment from 'moment'

Meteor.methods({
    "friendRequests.insert" (doc) {
        const { requester, requestee } = doc
        if (this.connection) {
            console.log(this.connection)
            if (!this.userId) throw new Meteor.Error('logged out')
            if (this.userId != requester) throw new Meteor.Error('500')
            if (FriendRequests.findOne({ requester, requestee })) throw new Meteor.Error("You've already made friend request in past 30 days.")
        }
        doc.status = 'pending'
        doc.dateSent = new Date()
        FriendRequests.insert(doc)
    },
    'friendRequests.ignore' ({ _id }) {
        FriendRequests.update({ _id, requestee: this.userId }, { $set: { status: 'ignore', dateReplied: new Date() } }, (err, res) => {
            if (res == 1) {
                removeRequest(_id)
            }
        })
    },
    'friendRequests.reject' ({ _id }) {
        FriendRequests.update({ _id, requestee: this.userId }, { $set: { status: 'reject', dateReplied: new Date() } }, (err, res) => {
            if (res == 1) {
                removeRequest(_id)
            }
        })
    },
    'friendRequests.block' ({ _id }) {
        FriendRequests.update({ _id, requestee: this.userId }, { $set: { status: 'block', dateReplied: new Date() } }, (err, res) => {
            if (res == 1) {
                removeRequest(_id)
            }
        })
    },
    'friendRequests.erase' ({ _id }) {
        FriendRequests.update({ _id, requestee: this.userId }, { $set: { status: 'erase', dateReplied: new Date() } }, (err, res) => {
            if (res == 1) {
                removeRequest(_id)
            }
        })
    },
    'friendRequests.accept' ({ _id, requestee, requester }) {
        FriendRequests.remove({ _id, requestee: this.userId })
        Meteor.call('friends.insert', { firstId: requester, requesteeId: requestee })
    },
})

function removeRequest(id) {
    const date = moment().add(30, 'days')
    SyncedCron.add({
        name: 'deleteFriendRequest' + id,
        schedule: function(parser) {
            return parser.recur().on(date).fullDate()
        },
        job: function() {
            FriendRequests.remove(id)
        }
    });
}
