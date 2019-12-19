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
        const owners = Owners.find({ ownerId: Meteor.userId(), approved: false }).fetch().map(x=>x)
        console.log(owners)
        const res = Posts.find({
            _id: {
                $in: owners
            }
        }).fetch()
        console.log(res)
        return res
    }
});

Template.dashboard.events({

});

Template.dashboard.onDestroyed(function() {})
