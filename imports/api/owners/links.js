// import Friends from './friends.js';
// import Users from '/imports/api/users/collection.js';
import { Owners, Posts, Users } from '../cols.js'

Owners.addLinks({
    owner: {
        collection: Users,
        inversedBy: 'wall'
    },
    post: {
        collection: Posts,
        inversedBy: 'owners',
    }
});
