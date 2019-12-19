import './dashboard.html';
import { Posts, Owners } from '/imports/api/cols.js'

Template.dashboard.onCreated(function() {
    this.autorun(() => {
        SubsCache.subscribe('posts.all')
        SubsCache.subscribe('owners.all')
        SubsCache.subscribe('users.all')

    })
});

Template.dashboard.helpers({
    posts() {
        const templ = Template.instance()
        const { query, handle } = templ
        const res = Owners.find({ ownerId: Meteor.userId(), approved: false }).map(x => {
            return Posts.find(x.postId)
        })

        return res
    }
});

Template.dashboard.events({

});

Template.dashboard.onDestroyed(function() {})
