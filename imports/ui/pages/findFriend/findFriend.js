import './findFriend.html';
import { FriendRequests, Users, Friends } from '/imports/api/cols.js'
import 'corejs-typeahead'

//for some reason using the meteor package, list wont render if accepting input value parameter in helper
Template.findFriend.onCreated(function() {
    SubsCache.subscribe('users.all')
    SubsCache.subscribe('friendRequests.all')
    SubsCache.subscribe('friends.all')

    this.username = new ReactiveVar("")
});

Template.findFriend.onRendered(function() {
    console.log($('.typeahead').typeahead)

    function mySource(query, sync, aasync) {
        const username = query

        if (username == "") {
            return []
        }
        const reg = new RegExp(escapeRegex(username), 'gi')
        const nonRequested = FriendRequests.find({ requester: Meteor.userId() }).fetch().map(x => Users.findOne(x.requestee)._id)
        const nonFriend = Friends.find({ owner: Meteor.userId() }).fetch().map(x => Users.findOne(x.target)._id)
        console.log(nonFriend.length, nonRequested.length, reg)
        const res = Users.find({
                _id: { $nin: nonRequested.concat(nonFriend) },
                $or: [{ "profile.last": reg }, { "profile.first": reg }]
            }).fetch()
            // .map(x => (x._id))
            .map(x => ({ ...x, value: `${x.profile.first} ${x.profile.last}` }))
        console.log('res', res)
        sync(res)
        // return ['abcd', 'abte', 'abxd', 'abersssssssss']
    }
    // Meteor.typeahead($('.typeahead'))
    $('.typeahead').typeahead({}, {
        name: 'my-dataset',
        source: mySource,
        display: 'value',
    });

    $('.typeahead').bind('typeahead:select', function(ev, suggestion) {
        Meteor.call('friendRequests.insert', { requester: Meteor.userId(), requestee: suggestion._id }, (err, res)=>{
            if (res){
                alert('user requested')
            }
        })
    });
})

Template.findFriend.helpers({

});

Template.findFriend.events({
});

Template.findFriend.onDestroyed(function() {})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
