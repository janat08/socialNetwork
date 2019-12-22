import './redis';

import '/imports/api/friendRequests/frMethods.js'
import '/imports/api/friends/fMethods.js'
import '/imports/api/owners/oMethods.js'
import '/imports/api/posts/pMethods.js'
import '/imports/api/users/uMethods.js'
import '/imports/api/publications.js'

// Loads the demo data
import './fixtures.js';

// Initializez grapher-live usage
import './grapher-live.js';

import './user-presence';

Meteor.startup(() => {
    // Kadira.connect('XG2ZaxPrjfgHwuweY', 'b47ed6f3-51c6-4d31-a5bb-82543970c224');
});

Meteor.publish('test', function () {
    return Meteor.users.find();
})