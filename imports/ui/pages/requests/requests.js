import './requests.html';
import { FriendRequests, Users } from '/imports/api/cols.js'

Template.requests.onCreated(function() {
    SubsCache.subscribe('friendRequests.all')
    SubsCache.subscribe('users.all')
});

Template.requests.helpers({
    requests() {
        const requests = FriendRequests.find({ requestee: Meteor.userId(), status: { $ne: "erase" } }).fetch()
        return requests.map(x => {
            x.user = Users.findOne(x.requestee)
            return x
        }).sort((x, y) => {
            return x.status.localeCompare(y.status)
        })
    },
    myRequests() {
        const requests = FriendRequests.find({ requester: Meteor.userId(), status: { $ne: 'block' } }).fetch()
        return requests.map(x => {
            x.user = Users.findOne(x.requestee)
            if (['reject', 'erase'].indexOf(x.status) != -1) {
                x.status = "pending"
                delete x.dateReplied
            }
            return x
        }).sort((x, y) => {
            return x.status.localeCompare(y.status)
        })
    },
    myRequestsBlocked() {
        const requests = FriendRequests.find({ requester: Meteor.userId(), status: 'block' }).fetch()
        return requests.map(x => {
            x.user = Users.findOne(x.requestee)
            return x
        })
    }
});

Template.requests.events({
    'click .acceptJs' (ev, templ) {
        Meteor.call('friendRequests.accept', this)

    },
    'click .rejectJs' (ev, templ) {
        Meteor.call('friendRequests.reject', this)
    },
    'click .blockJs' (ev, templ) {
        Meteor.call('friendRequests.block', this)
    },
    'click .eraseJs' (ev, templ) {
        Meteor.call('friendRequests.erase', this)
    }
});

Template.requests.onDestroyed(function() {})
