import './friends.html';
import { Friends } from '/imports/api/cols.js'

Template.friends.onCreated(function() {
    SubsCache.subscribe('friends.all')
    SubsCache.subscribe('users.all')
});

Template.friends.helpers({
    friends() {
        const basic = Friends.find({ owner: Meteor.userId() }).fetch().filter(x => x.type == 'basic').map(mapUser)
        const family = Friends.find({ owner: Meteor.userId() }).fetch().filter(x => x.type == 'family').map(mapUser)
        return {family, basic}
    }
});

Template.friends.events({

});

Template.friends.onDestroyed(function() {})


function mapUser(friend) {
    friend.target = Meteor.users.findOne(friend.target)
    return friend
}
