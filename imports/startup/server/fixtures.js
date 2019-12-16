// // import { Random } from 'meteor/random';

// import {Users, Posts, Friends, FriendRequests} from '/imports/api/cols.js'

// const USERS = 20;
// const POST_PER_USER = 10;
// const REQUESTS = 10
// const FRIENDS = 10
// const POSTS = [
//     'Good', 'Bad', 'Neutral'
// ];

// const createUser = (email, password) => {
//     const userId = Accounts.createUser({email, password});
//     return Users.findOne(userId);
// };

// Meteor.startup(() => {
//     if (Users.find().count() > 0 || true) {
//         return;
//     }

//     createUser('admin@app.com', '12345', 'ADMIN');

//     let tags = TAGS.map(name => Tags.insert({name}));
//     let groups = GROUPS.map(name => Groups.insert({name}));

//     let users = [];
//     _.each(_.range(USERS), (idx) => {
//         users.push(
//             createUser(`user-${idx + 1}@app.com`, '12345')
//         );
//     });
    

//     _.each(users, (user) => {
//         const userPostLink = Users.getLink(user, 'posts');
//         const userFriendsLink = Users.getLink(user, 'friends');
//         const userRequestsLink = Users.getLink(user, 'requests');
//         const userWallLink = Users.getLink(user, 'wall');
//         _.each(users, (friend, i)=>{
//             const half = USERS/2
//             if (half < i){
//                 userFriendsLink.add()
//             } else {
                
//             }
//         })
//         _.each(_.range(POST_PER_USER), (idx) => {
//             let post = {
//                 title: `User Post - ${idx}`,
//                 content: _.sample(POSTS)
//             };

//             userPostLink.add(post);
//             const postCommentsLink = Posts.getLink(post, 'comments');
//             const postTagsLink = Posts.getLink(post, 'tags');
//             const postGroupLink = Posts.getLink(post, 'group');
//             postGroupLink.set(_.sample(groups), {random: Random.id()});

//             postTagsLink.add(_.sample(tags));

//             _.each(_.range(COMMENTS_PER_POST), (idx) => {
//                 let comment = {
//                     text: _.sample(COMMENT_TEXT_SAMPLES)
//                 };

//                 postCommentsLink.add(comment);
//                 Comments.getLink(comment, 'user').set(_.sample(users));
//             })
//         })
        
//         // _.each(_.range(POST_PER_USER), (idx) => {
//         //     let post = {
//         //         title: `User Post - ${idx}`
//         //     };

//         //     userPostLink.add(post);
//         //     const postCommentsLink = Posts.getLink(post, 'comments');
//         //     const postTagsLink = Posts.getLink(post, 'tags');
//         //     const postGroupLink = Posts.getLink(post, 'group');
//         //     postGroupLink.set(_.sample(groups), {random: Random.id()});

//         //     postTagsLink.add(_.sample(tags));

//         //     _.each(_.range(COMMENTS_PER_POST), (idx) => {
//         //         let comment = {
//         //             text: _.sample(COMMENT_TEXT_SAMPLES)
//         //         };

//         //         postCommentsLink.add(comment);
//         //         Comments.getLink(comment, 'user').set(_.sample(users));
//         //     })
//         // })
//     });

//     console.log('[ok] fixtures have been loaded.');
// });