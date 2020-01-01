import './yourWall.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Posts, Owners, Users } from '/imports/api/cols.js'

Template.yourWall.onCreated(function() {
    SubsCache.subscribe('posts.all')
    SubsCache.subscribe('owners.all')
    SubsCache.subscribe('users.all')
});

Template.yourWall.helpers({
    posts() {
        const owners = Owners.find({ ownerId: Meteor.userId(), approved: true }).fetch()
        const posts = Posts.find({ _id: { $in: owners.map(x => x.postId) } })
        return posts.fetch().map((x, i) => {
            const user = Users.findOne(x.authorId)
            const { profile } = user
            if (!profile || !profile.first) {
                x.name = user.username
            }
            else {
                x.name = profile.first + " " + profile.last
            }
            return x
        })

    },
});

Template.yourWall.events({

});

Template.yourWall.onDestroyed(function() {})
