import './friends.html';
import { Friends, friendTypes } from '/imports/api/cols.js'
import '/imports/ui/components/imageShow/imageShow.js'
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.friends.onCreated(function() {
    SubsCache.subscribe('friends.all')
    SubsCache.subscribe('users.all')
});

Template.friends.helpers({
    friends() {
        const friends = Friends.find({ owner: Meteor.userId() }).fetch().filter(x => x.type == 'friends').map(mapUser)
        const family = Friends.find({ owner: Meteor.userId() }).fetch().filter(x => x.type == 'family').map(mapUser)
        const colleagues = Friends.find({ owner: Meteor.userId() }).fetch().filter(x => x.type == 'colleague').map(mapUser)
        const besties = Friends.find({ owner: Meteor.userId() }).fetch().filter(x => x.type == 'besties').map(mapUser)
        return { family, friends, besties, colleagues }
    },
});

Template.friendItem.helpers({
    friendTypes() {
        return friendTypes
    },
    selectedType(val) {
        if (this.type == val) {
            return 'selected'
        }
    },
    blockStatus() {
        if (this.blocked) {
            return "Unblock"
        }
        else {
            return "Block"
        }
    }
});

Template.friends.events({
    'change .selectTypeJs' (e, t) {
        Meteor.call('friends.typeSelect', { ...this, selected: e.target.value })
    },
    'click .blockJs' (e, t) {
        Meteor.call('friends.toggleBlock', this)
    },
    'click .bestiesJs' (e, t) {
        messageAll('besties')

    },
    'click .familyJs' (e, t) {
        messageAll('family')

    },
    'click .colleaguesJs' (e, t) {
        messageAll('colleagues')

    },
    'click .friendsJs' (e, t) {
        messageAll('friends')
    },
});

function messageAll(type) {
    FlowRouter.go("/post/"+type)
}
Template.friends.onDestroyed(function() {})


function mapUser(friend) {
    friend.target = Meteor.users.findOne(friend.target)
    return friend
}
