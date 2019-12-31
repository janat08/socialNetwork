import './findFriend.html';
import { FriendRequests, Users } from '/imports/api/cols.js'
import 'corejs-typeahead'
import './findFriend.css'
//for some reason using the meteor package, list wont render if accepting input value parameter in helper
Template.findFriend.onCreated(function() {
    SubsCache.subscribe('users.all')
    SubsCache.subscribe('friendRequests.all')
    SubsCache.subscribe('friends.all')

    this.username = new ReactiveVar("")
});

Template.findFriend.onRendered(function() {
    function sourcesFactory(queryMod, value, value2) {
        return function(query, sync, aasync) {
            const username = query

            if (username == "") {
                return []
            }
            const reg = new RegExp(escapeRegex(username), 'gi')
            const nonRequested = FriendRequests.find({ $or: [{requester: Meteor.userId()}, {requestee: Meteor.userId()}] }).fetch().map(x => Users.findOne(x.requestee)._id)
            const nonFriended = Meteor.user().friends.map(x=>x.targetId)
            const res = Users.find({
                    _id: { $nin: nonRequested.concat(nonFriended) },
                    $or: [{
                        [queryMod]: reg
                    }]
                }).fetch()
                .map(x => ({ ...x, value: `${x[value[0]][value[1]]} ${value2 && (x[value2[0]][value2[1]])}` }))
            sync(res)
        }
    }

    $('.typeahead ').typeahead({},{
        name: 'first',
        source: sourcesFactory("profile.first", ['profile', 'first'], ['profile', 'last']),
        display: 'value',
    }, {
        name: 'street',
        source: sourcesFactory("address.street", ['address', 'street']),
        display: 'value',
    }, {
        name: 'city',
        source: sourcesFactory("address.city", ['address', 'city']),
        display: 'value',
    }, {
        name: 'country',
        source: sourcesFactory("address.country", ['address', 'country']),
        display: 'value',
    }, {
        name: 'occupation',
        source: sourcesFactory("work.occupation", ['work', 'occupation']),
        display: 'value',
    }, {
        name: 'company',
        source: sourcesFactory("work.company", ['work', 'company']),
        display: 'value',
    }, {
        name: 'startedWorkYear',
        source: sourcesFactory("work.startedWorkYear", ['work', 'startedWorkYear']),
        display: 'value',
    });

    $('.typeahead').bind('typeahead:select', function(ev, suggestion) {
        Meteor.call('friendRequests.insert', { requester: Meteor.userId(), requestee: suggestion._id }, (err, res) => {
            if (err) {
                alert(err)
            }
            else {
                alert('user requested')
            }
        })
    });
})

Template.findFriend.helpers({

});

Template.findFriend.events({});

Template.findFriend.onDestroyed(function() {})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
