import './findFriend.html';
import { findFriends } from '/imports/api/queries.js'
import {Posts} from '/imports/api/cols.js'

Template.findFriend.onCreated(function() {
    this.autorun(() => {
        const params = {
            _id: Meteor.userId(),
        }
        this.query = findFriends.clone({ params });

        this.handle = this.query.subscribe(); // handle.ready()
    })
});

Template.findFriend.helpers({
    findFriends() {
        const templ = Template.instance()
        const { query, handle } = templ
        return query.fetch().friends
    }
});

Template.findFriend.events({
    'click .requestFriendJs'(ev, templ){
        Meteor.call('requestFriend.request', {requestee: this._id})
    },
});

Template.findFriend.onDestroyed(function() {})
