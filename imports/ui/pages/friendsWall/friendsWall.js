import './friendsWall.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Posts, Owners, Users } from '/imports/api/cols.js'

Template.friendsWall.onCreated(function() {
    SubsCache.subscribe('posts.all')
    SubsCache.subscribe('owners.all')
    SubsCache.subscribe('users.all')
    
    this.autorun(() => {
        const user = Meteor.user()
        if (SubsCache.ready()) {
            const user = Users.findOne(FlowRouter.getParam('friendId'))
            const blocked = user.friends.find(x=>x.targetId==Meteor.userId()).blocked
            if (blocked || !user || user.friends.map(x => x.targetId).indexOf(FlowRouter.getParam('friendId')) == -1) {
                FlowRouter.go('App.home')
                return
            }
        }
    })
});

Template.friendsWall.helpers({
    posts() {
        const owners = Owners.find({ ownerId: FlowRouter.getParam('friendId'), approved: true }).fetch()
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
    friendship() {
        return FlowRouter.getParam('friendId')
    }
});

Template.friendsWall.events({

});

Template.friendsWall.onDestroyed(function() {})
