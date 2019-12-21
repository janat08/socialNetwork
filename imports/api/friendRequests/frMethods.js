import { FriendRequests } from '../cols.js'
import moment from 'moment'

Meteor.methods({
    "friendRequests.insert" (doc) {
        const { requester, requestee } = doc
        if (this.userId) throw new Meteor.Error('logged out')
        if (this.userId != requester) throw new Meteor.Error('500')
        if (FriendRequests.findOne({ requester, requestee })) throw new Meteor.Error("You've already made friend request in past 30 days.")
        doc.status = 'pending'
        FriendRequests.insert(doc)
    },
    'friendRequests.ignore' ({ _id }) {
        requesteeCheck(_id)
        FriendRequests.update(_id, { $set: { status: 'ignore' } })
        removeRequest(_id)
    },
    'friendRequests.reject' ({ _id }) {
        requesteeCheck(_id)
        FriendRequests.update(_id, { $set: { status: 'reject' } })
        removeRequest(_id)
    },
    'friendRequests.accept' ({ _id, requestee, requester }) {
        requesteeCheck(requestee)
        FriendRequests.remove(_id)
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

function requesteeCheck({ _id, requestee }) {
    if (!requestee) {
        requestee = FriendRequests.findOne(_id)
        if (!requestee) {
            throw new Meteor.Error('500')
        }
        else {
            requestee = requestee.requestee
        }
    }
    if (this.connection) {
        if (this.userId != requestee) {
            throw new Meteor.Error('500')
        }
    }
}
