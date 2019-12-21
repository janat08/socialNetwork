import './friendsWall.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Posts, Owners, Friends, Users } from '/imports/api/cols.js'

Template.friendsWall.onCreated(function() {
    SubsCache.subscribe('friends.all')
    SubsCache.subscribe('posts.all')
    SubsCache.subscribe('owners.all')
    this.friendship = new ReactiveVar()
    this.target = new ReactiveVar()
    this.autorun(() => {
        const friend = FlowRouter.getParam('friendId')
        const target = Friends.findOne(friend)
        this.friendship.set(target)
        this.target.set(Users.findOne(target.target))
    })
});

Template.friendsWall.helpers({
    posts() {
        const { target, friendship } = Template.instance()
        if (friendship.get()) {
            return Owners.find({ ownerId: friendship.get().target, approved: true })

        }
    },

});

Template.friendsWall.events({

});

Template.friendsWall.onDestroyed(function() {})
