import './findFriend.html';
import { FriendRequests, Users, Friends } from '/imports/api/cols.js'

Template.findFriend.onCreated(function() {
    SubsCache.subscribe('users.all')
    SubsCache.subscribe('friendRequests.all')
    SubsCache.subscribe('friends.all')

    this.username = new ReactiveVar("")
});

Template.findFriend.onRendered(function() {
    Meteor.typeahead($('.typeahead'), function(query, sync, asyncc) {
        const { username } = this
        if (query == "") {
            return []
        }
        const reg = new RegExp(escapeRegex(query), 'gi')
        const nonRequested = FriendRequests.find({ requester: Meteor.userId() }).fetch().map(x => Users.findOne(x.requestee)._id)
        const nonFriend = Friends.find({ owner: Meteor.userId() }).fetch().map(x => Users.findOne(x.target)._id)
        console.log(nonFriend, nonRequested, nonFriend.concat(nonRequested))
        const res = Users.find({ _id: { $nin: nonRequested.concat(nonFriend) }, username: reg }).fetch().map(x => ({ id: x._id, value: x.username }))
        console.log(res)
        return res
    })
})

Template.findFriend.helpers({
    findFriends() {
        const { username } = Template.instance()
        if (username.get() == "") {
            return []
        }
        const reg = new RegExp(escapeRegex(username.get()), 'gi')
        const nonRequested = FriendRequests.find({ requester: Meteor.userId() }).fetch().map(x => Users.findOne(x.requestee)._id)
        const nonFriend = Friends.find({ owner: Meteor.userId() }).fetch().map(x => Users.findOne(x.target)._id)
        console.log(nonFriend, nonRequested, nonFriend.concat(nonRequested))
        const res = Users.find({ _id: { $nin: nonRequested.concat(nonFriend) }, username: reg }).fetch().map(x => ({ id: x._id, value: x.username }))
        console.log(res)
        return res
    }
});

Template.findFriend.events({
    'click .requestFriendJs' (ev, templ) {
        Meteor.call('friendRequests.insert', { requester: Meteor.userId(), requestee: this._id })
    },
    'keyup .searchJs' (ev, templ) {
        console.log(ev.target.value)
        templ.username.set(ev.target.value)
    }
});

Template.findFriend.onDestroyed(function() {})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
