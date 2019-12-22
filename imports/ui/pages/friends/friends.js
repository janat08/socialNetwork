import './friends.html';
import { Friends } from '/imports/api/cols.js'

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
    }
});

Template.friends.events({
    
});

Template.friends.onDestroyed(function() {})


function mapUser(friend) {
    friend.target = Meteor.users.findOne(friend.target)
    return friend
}
