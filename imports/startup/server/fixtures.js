// // import { Random } from 'meteor/random';

import { Users, Posts, Friends, FriendRequests, Owners, friendTypes } from '/imports/api/cols.js'

const USERS = 30;
const POST_PER_USER = 10;
const REQUESTS = 10
const FRIENDS = 10
const POSTS = [
    'Good', 'Bad', 'Neutral'
];
const FRIEND_TYPES = friendTypes

const createUser = (email, password, username) => {
    const userId = Accounts.createUser({ email, password, username });
    Users.update(userId, { $set: { profile: { first: "first", last: "last" } } })
    return Users.findOne(userId);
};


Meteor.startup(() => {
    if (!Users.find().count() || !true) {
        Posts.remove({})
        Owners.remove({})
        Users.remove({})
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
                const user1 = Users.findOne(target._id)
                if (FriendRequests.find({ $or: [{ requestee: target._id }, { requestee: user._id }] }).count() ||
                    user1.friends && user1.friends.findIndex(x => x.targetId == user._id) != -1 ||
                    target._id == user._id) {
                    return asdf(i + 1)
                }
                else {
                    // written+=1
                    if (i % 3 == 1 || i % 3 == 0) {
                        const request = {
                            dateSent: new Date(),
                            requestee: target._id,
                            requester: user._id,
                        }
                        const id = Meteor.call('friendRequests.insert', request)
                        if (i % 3 == 0) {
                            Meteor.call('friendRequests.accept', { _id: id })
                        }
                    }
                    return asdf(i + 1)
                }
            }
        });
        users = Users.find().fetch()
        _.each(users, (idx, i) => {
            if (idx.friends) {
                let post = {
                    title: `User Post - ${idx._id}`,
                    content: _.sample(POSTS),
                    friendIds: idx.friends.map(x => x.targetId),
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
