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
            x.username = Users.findOne(x.requester).username
            return x
        })
    }
});

Template.requests.events({
    'click .ignoreJs' (ev, templ) {
        Meteor.call('friendRequests.ignore', this)
    },
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
