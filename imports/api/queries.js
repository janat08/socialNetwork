import { createQuery } from 'meteor/cultofcoders:grapher';

export const wall = createQuery({
    users: {
        $filter({ filters, options, params }) {
            const { _id, approved } = params
            if (_id) {
                filters._id = params._id
            }
            if (approved) {
                filters.approved = params.approved
            }
            console.log(params, filters)
        },
        profile: 1,
        createdAt: 1,
        services: 1,
        wall: {
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
})
