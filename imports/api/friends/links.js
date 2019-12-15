// import Friends from './friends.js';
// import Users from '/imports/api/users/collection.js';
import {Users, Friends} from '../cols.js'

Friends.addLinks({
    friends: {
        type: 'many',
        collection: Users,
        field: 'users',
        index: true
    },
});
