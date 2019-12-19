// // import { Random } from 'meteor/random';

import { Users, Posts, Friends, FriendRequests, Owners } from '/imports/api/cols.js'
import { createQuery } from 'meteor/cultofcoders:grapher';

const USERS = 10;
const POST_PER_USER = 10;
const REQUESTS = 10
const FRIENDS = 10
const POSTS = [
    'Good', 'Bad', 'Neutral'
];

const createUser = (email, password) => {
    const userId = Accounts.createUser({ email, password });
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
    Posts.remove({})
    Owners.remove({})
    Users.remove({})
    Friends.remove({})
    FriendRequests.remove({})

    let users = [];
    _.each(_.range(USERS), (idx) => {
        users.push(createUser(`asdf${idx + 1}@asdf`, 'asdfasdf'))
    });

    _.each(users, (user) => {

        asdf()

        function asdf(i = 0, requests = 0, friends = 0, none = 0) {
            const target = users[i]
            if (i == users.length - 1) {
                return
            }

            if (FriendRequests.find({ $or: [{ requestee: target._id }, { requestee: user._id }] }).count() ||
                Friends.find({owner: {$in: [target._id, user._id]}}).count()
                || target._id == user._id) {
                return asdf(i + 1)
            }
            else {
                if (i%3 == 0) {
                    Meteor.call('friends.insert', {firstId: target._id, secondId: user._id})
                }
                else if (i%3 == 1){
                    const friend = {
                        status: "bad",
                        date: new Date(),
                        requestee: target._id,
                        requester: user._id,
                    }
                    Meteor.call('friendRequests.insert', friend)
                }
                return asdf(i + 1)
            }
        }
        // console.log(Friends.find().fetch(), Users.find().fetch())

        const user1 = Users.findOne(user._id)
        // console.log(user1)
        _.each(user1.friendsIds, (idx, i) => {

            let post = {
                title: `User Post - ${idx._id}`,
                content: _.sample(POSTS),
                ownerIds: user1.friendsIds.map(x => x._id),
                approved: false,
                authorId: user1._id,
            };
            post = Meteor.call('posts.insert', post)

        })
    });


});
