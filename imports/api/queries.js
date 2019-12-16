import { createQuery } from 'meteor/cultofcoders:grapher';

export const wall = createQuery({
    users: {
        $filter({ filters, params }) {
            filters._id = params._id
            filters.approved = params.approved
        },
        postsIds: 1,
        posts: {
            type: 1,
            author: {
                name: 1
            },
            title: 1,
            content: 1,
            imageId: 1,
        }
    }
});

export const friendRequests = createQuery({
    users: {
        $filter({ filters, params }) {
            filters._id = params._id
        },
        friendIds: 1,
        friends: {
            type: 1,
            user: {
                name: 1
            }
        }
    }
});

export const friends = createQuery({
    users: {
        $filter({ filters, params }) {
            filters._id = params._id
        },
        friendIds: 1,
        friends: {
            type: 1,
            user: {
                name: 1
            }
        }
    }
});

export const findFriends = createQuery({
    friends: {
        $filter({ filters, params }) {
            filters.oneOfpeople = params._id
        },
        friendIds: 1,
        friends: {
            type: 1,
            user: {
                name: 1
            }
        }
    }
}
})
