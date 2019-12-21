import './findFriend.html';
import { findFriends } from '/imports/api/queries.js'
import {Posts, Users} from '/imports/api/cols.js'

Template.findFriend.onCreated(function() {
    SubsCache.subscribe('users.all')
    this.username = new ReactiveVar("")
});

Template.findFriend.helpers({
    findFriends() {
        const {username} = Template.instance()
        const reg = new RegExp(escapeRegex(username.get()), 'gi')
        return Users.find({username: reg})
    }
});

Template.findFriend.events({
    'click .requestFriendJs'(ev, templ){
        Meteor.call('requestFriend.request', {requester: Meteor.userId(), requestee: this._id})
    },
    'keyup .searchJs'(ev, templ){
        console.log(ev.target.value)
        templ.username.set(ev.target.value)
    }
});

Template.findFriend.onDestroyed(function() {})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};