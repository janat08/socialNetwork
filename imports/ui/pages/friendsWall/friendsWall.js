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
        if (target) {
            this.friendship.set(target)
        }
    })
});

Template.friendsWall.helpers({
    posts() {
        const { friendship } = Template.instance()
        if (friendship.get()) {
            const owners = Owners.find({ ownerId: friendship.get().target, approved: true }).fetch()
            const posts = Posts.find({ _id: { $in: owners.map(x => x.postId) } })
            return posts
        }
    },
    friendship(){
        return Template.instance().friendship.get()
    }
});

Template.friendsWall.events({

});

Template.friendsWall.onDestroyed(function() {})
