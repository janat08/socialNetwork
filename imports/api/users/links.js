// import Users from './collection.js';
// import Comments from '/imports/api/comments/collection.js';
// import Posts from '/imports/api/posts/collection.js';
// import Groups from '/imports/api/groups/collection.js';
import { Users, Friends, Posts, FriendRequests } from '../cols.js'

Users.addLinks({
    posts: {
        inversedBy: 'wall',
        collection: Posts
    },
    friends: {
        collection: Friends,
        field: 'friends',
        type: 'many',
        metadata: true,
    },
    requests: {
        collection: FriendRequests,
        field: 'requestor',
        type: 'many',
    },
    wall: {
        collection: Posts,
        field: 'recipient',
        type: 'many',
    }
});

// Users.addReducers({
//     email: {
//         body: {
//             emails: 1
//         },
//         reduce(object) {
//             return object.emails[0].address
//         }
//     }
// });
