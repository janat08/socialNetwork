// // import { Random } from 'meteor/random';

import { Users, Posts, Friends, FriendRequests, Owners } from '/imports/api/cols.js'
import { createQuery } from 'meteor/cultofcoders:grapher';

const USERS = 3;
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
            createUser(`asdf${idx + 1}@asdf`, 'asdfasdf')
        
    });


    users = Users.find().fetch()
    users = users.map(x => {
        x.links = {
            PostLink: Users.getLink(x, 'posts'),
            FriendsLink: Users.getLink(x, 'friends'),
            RequestsLink: Users.getLink(x, 'requests'),
            WallLink: Users.getLink(x, 'wall'),
        }
        return x
    })


    _.each(users, (user) => {
        const { PostLink, RequestsLink, FriendsLink, WallLink } = user.links

        asdf()

        function asdf(i = 0, requests = 0, friends = 0) {
            const { links } = users[i]
            const target = users[i]
            if (i == users.length - 1) {
                return
            }

            if (FriendsLink.fetch({ owner: target._id }).length ||
                RequestsLink.fetch({ $or: [{ requestee: target._id }, { requestee: user._id }] }).length) {

                return asdf(i + 1, requests, friends)
            }
            else {
                if (requests >= friends) {
                    const friend = {
                        target: target._id,
                        type: "asdf",
                    }
                    FriendsLink.add(friend)
                    const friend1 = {
                        target: user._id,
                        type: "asdf",
                    }
                    links.FriendsLink.add(friend1)
                    friends += 1
                }
                else {
                    const friend = {
                        status: "bad",
                        date: new Date(),
                        requestee: target._id,
                        requester: user._id,
                    }
                    RequestsLink.add(friend)
                    requests += 1
                }
                return asdf(i + 1, requests, friends)
            }
        }
        console.log(Friends.find().fetch(), Users.find().fetch())

        const user1 = Users.findOne(user._id)
        console.log(user1)
        _.each(user1.friendsIds, (idx, i) => {

            let post = {
                title: `User Post - ${idx._id}`,
                content: _.sample(POSTS),
                // ownerIds: user1.friendsIds.map(x => x._id),
                approved: false,
                authorId: user1._id,
            };
            post = PostLink.add(post);
            const owners = Posts.getLink(post, 'owners')

            let item
            if (i % 2) {
                item = owners.add({ approved: true })
            }
            else {
                item = owners.add({ approved: false })
            }
            console.log(item.object.object._id, idx)

            const uOwners = Users.getLink(idx._id, 'wall')
            uOwners.add(item.object._id) 

        })

        // _.each(_.range(POST_PER_USER), (idx) => {
        //     let post = {
        //         title: `User Post - ${idx}`
        //     }; 

        //     userPostLink.add(post);
        //     const postCommentsLink = Posts.getLink(post, 'comments');
        //     const postTagsLink = Posts.getLink(post, 'tags');
        //     const postGroupLink = Posts.getLink(post, 'group');
        //     postGroupLink.set(_.sample(groups), {random: Random.id()});

        //     postTagsLink.add(_.sample(tags));

        //     _.each(_.range(COMMENTS_PER_POST), (idx) => {
        //         let comment = {
        //             text: _.sample(COMMENT_TEXT_SAMPLES)
        //         };

        //         postCommentsLink.add(comment);
        //         Comments.getLink(comment, 'user').set(_.sample(users));
        //     })
        // })
    });
    // console.log('query', wall.clone, wall.fetch())
    console.log('[ok] fixtures have been loaded.');
});
