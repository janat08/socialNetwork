// // import { Random } from 'meteor/random';

import { Users, Posts, Friends, FriendRequests, Owners } from '/imports/api/cols.js'
import { createQuery } from 'meteor/cultofcoders:grapher';

const USERS = 20;
const POST_PER_USER = 10;
const REQUESTS = 10
const FRIENDS = 10
const POSTS = [
    'Good', 'Bad', 'Neutral'
];
const FRIEND_TYPES = ['basic', 'family']

const createUser = (email, password, username) => {
    const userId = Accounts.createUser({ email, password, username });
    return Users.findOne(userId);
};

const wall = createQuery({
    users: {
        $filter({ filters, params }) {
            filters._id = params._id
            filters.approved = params.approved
        },
        profile: 1
    }
});

Meteor.startup(() => {
    if (!Users.find().count() || !true) {
        Posts.remove({})
        Owners.remove({})
        Users.remove({})
        Friends.remove({})
        FriendRequests.remove({})


        let users = [];
        _.each(_.range(USERS), (idx) => {
            users.push(createUser(`asdf${idx + 1}@asdf`, 'asdfasdf', idx + 1 + "user"))
        });

        _.each(users, (user) => {
            var skipped = 0
            var written = 0
            asdf()

            function asdf(i = 0, ) {
                const target = users[i]
                if (i == users.length - 1) {
                    return
                }

                if (FriendRequests.find({ $or: [{ requestee: target._id }, { requestee: user._id }] }).count() ||
                    Friends.find({ owner: target._id, target: user._id }).count() ||
                    target._id == user._id) {
                    //  skipped+=1
                    // console.log('skipping', Friends.find({ owner: target._id, target: user._id}).count(), FriendRequests.find({ $or: [{ requestee: target._id }, { requestee: user._id }] }).count())
                    return asdf(i + 1)
                }
                else {
                    // written+=1
                    if (i % 2 == 0) {
                        Meteor.call('friends.insert', { firstId: target._id, requesteeId: user._id, type: _.sample(FRIEND_TYPES) })
                    }
                    else if (i % 2 == 1) {
                        const request = {
                            status: "bad",
                            date: new Date(),
                            requestee: target._id,
                            requester: user._id,
                        }
                        Meteor.call('friendRequests.insert', request)
                    }
                    return asdf(i + 1)
                }
            }
        });
        users = Users.find().fetch()
        _.each(users, (idx, i) => {
            if (idx.friendIds) {
                let post = {
                    title: `User Post - ${idx._id}`,
                    content: _.sample(POSTS),
                    friendIds: idx.friendIds,
                    authorId: idx._id,
                };
                post = Meteor.call('posts.insert', post)
            }
        })

        _.each(Owners.find().fetch(), (owner) => {
            Owners.update(owner._id, { $set: { approved: _.sample([false, true]) } })
        })
    }
});
