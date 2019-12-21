import './requests.html';
import { FriendRequests, Users } from '/imports/api/cols.js'

Template.requests.onCreated(function() {
    SubsCache.subscribe('friendRequests.all')
    SubsCache.subscribe('users.all')
});

Template.requests.helpers({
    requests() {
        const requests = FriendRequests.find({ requestee: Meteor.userId() }).fetch()
        return requests.map(x => {
            x.username = Users.findOne(x.requester).username
            return x
        })
    }
});

Template.requests.events({
    'click .ignoreJs'(ev, templ) {
        Meteor.call('friendRequests.ignore', this)
    },
    'click .acceptJs'(ev, templ) {
        Meteor.call('friendRequests.accept', this)

    },
    'click .rejectJs'(ev, templ) {
        Meteor.call('friendRequests.reject', this)
    }
});

Template.requests.onDestroyed(function() {})
