import './friendsWall.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Posts, Owners, Friends, Users } from '/imports/api/cols.js'

Template.friendsWall.onCreated(function() {
    SubsCache.subscribe('friends.all')
    SubsCache.subscribe('posts.all')
    SubsCache.subscribe('owners.all')
    SubsCache.subscribe('users.all')
    this.friendship = new ReactiveVar()
    this.target = new ReactiveVar()
    this.autorun(() => {
        const friend = FlowRouter.getParam('friendId')
        const target = Friends.findOne(friend)
        if (target) {
            this.friendship.set(target)
        }
    })
    this.autorun(() => {
        const friend = Friends.findOne(FlowRouter.getParam('friendId'))
        if (SubsCache.ready()) {
            if (!friend || !Meteor.userId() || friend.owner != Meteor.userId()) {
                FlowRouter.go('App.home')
                return
            }
        }
    })
});

Template.friendsWall.helpers({
    posts() {
        const { friendship } = Template.instance()
        if (friendship.get()) {
            const owners = Owners.find({ ownerId: friendship.get().target, approved: true }).fetch()
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
        }
    },
    friendship() {
        return Template.instance().friendship.get()
    }
});

Template.friendsWall.events({

});

Template.friendsWall.onDestroyed(function() {})
