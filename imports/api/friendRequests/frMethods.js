import { FriendRequests, Users, friendTypes } from '../cols.js'
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
        console.log("inserting")
        return FriendRequests.insert(doc)
    },
    'friendRequests.reject' ({ _id }) {
        FriendRequests.update({ _id, requestee: this.userId }, { $set: { rejected: true, pending: false, dateReplied: new Date() } }, (err, res) => {})
    },
    'friendRequests.block' ({ _id }) {
        FriendRequests.update({ _id, requestee: this.userId }, { $set: { blocked: true, pending: false, dateReplied: new Date() } }, (err, res) => {})
    },
    'friendRequests.erase' ({ _id }) {
        FriendRequests.update({ _id, requestee: this.userId }, { $set: { erased: true, pending: false, dateReplied: new Date() } }, (err, res) => {})
    },
    'friendRequests.accept' ({ _id }) {
        const FR = FriendRequests.findOne(_id)
        console.log(FR, this.userId)
        if (this.connection) {
            if (this.userId != FR.requestee) {
                throw new Meteor.Error('500')
            }
        }
        const startDate = new Date()
        FriendRequests.update(_id, { $set: { accepted: true, pending: false } })
        Users.update(FR.requestee, { $addToSet: { friends: { targetId: FR.requester, type: 'friends', startDate, blocked: false, request: _id } } })
        Users.update(FR.requester, { $addToSet: { friends: { targetId: FR.requestee, type: 'friends', startDate, blocked: false, request: _id } } })
    },
    // "friendRequests.typeSelect" ({ targetId, selected }) {
    //     if (!this.userId) throw new Meteor.Error("logged out")
    //     if (friendTypes.indexOf(selected) == -1) throw new Meteor.Error('500')
    //     Users.update({ _id: this.userId, targetId }, { $set: { "friends.$.type": selected } })
    //     Users.update({ _id: this.userId, targetId }, { $set: { "friends.$.type": selected } })
    // },
    // "friends.toggleBlock" ({ _id, blocked }) {
    //     if (!this.userId) throw new Meteor.Error("logged out")
    //     return Users.update({ _id: this.userId, targetId: _id }, { $set: { "friends.$.blocked": blocked }})
    // }
})


SyncedCron.add({
    name: 'deleteFriendRequest',
    schedule: function(parser) {
        return parser.text('every day')
    },
    job: function() {
        FriendRequests.remove({ $or: [{ block: { $nin: [true] } }, { block: { $exists: false } }], accept: { $nin: [true] }, dateReplied: { $lte: moment().subtract(1, 'months').date() } })
    }
});


// "friends.typeSelect" ({ _id, selected }) {
//     if (!this.userId) throw new Meteor.Error("logged out")
//     if (friendTypes.indexOf(selected) == -1) throw new Meteor.Error('500')
//     return Friends.update({ _id, owner: this.userId }, { $set: { type: selected } })
// },
// "friends.toggleBlock" ({ _id, blocked }) {
//     if (!this.userId) throw new Meteor.Error("logged out")
//     return Friends.update({ _id, owner: this.userId }, { $set: { blocked: !blocked } })
// }
