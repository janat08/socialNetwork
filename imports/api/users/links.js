// import Users from './collection.js';
// import Comments from '/imports/api/comments/collection.js';
// import Posts from '/imports/api/posts/collection.js';
// import Groups from '/imports/api/groups/collection.js';
import { Users, Friends, Posts, FriendRequests, Owners } from '../cols.js'

Users.addLinks({
    posts: {
        inversedBy: 'author',
        collection: Posts
    },
    friends: {
        collection: Friends,
        field: 'friendsIds',
        type: 'many',
        metadata: true,
    },
    requests: {
        collection: FriendRequests,
        field: 'requestsIds',
        type: 'many',
    },
    wall: {
        collection: Owners,
        type: 'many',
        field: 'wallIds'
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
