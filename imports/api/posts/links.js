// import Posts from './collection.js';
// import Users from '/imports/api/users/collection.js';
// import Comments from '/imports/api/comments/collection.js';
// import Tags from '/imports/api/tags/collection.js';
// import Groups from '/imports/api/groups/collection.js';
import {Users, Posts} from '../cols.js'

Posts.addLinks({
    owner: {
        type: 'one',
        collection: Users,
        field: 'ownerId',
        index: true
    },
    author: {
        type: 'one',
        collection: Users,
        field: 'authorId',
    },
});