import './dashboard.html';
import { Posts, Owners, Users, Instances } from '/imports/api/cols.js'

Template.dashboard.onCreated(function() {
    this.autorun(() => {
        SubsCache.subscribe('posts.all')
        SubsCache.subscribe('owners.all')
        SubsCache.subscribe('users.all')
        SubsCache.subscribe('instances.all')

    })
});

Template.dashboard.helpers({
    posts() {
        const templ = Template.instance()
        const { query, handle } = templ
        const owners = Owners.find({ ownerId: Meteor.userId(), approved: false }).fetch()
        console.log('owners', owners)

        const res = Posts.find({
            _id: {
                $in: owners.map(x => x.postId)
            }
        }).fetch().map((x, i) => {
            x.username = Users.findOne(x.authorId).username
            return x
        }).map(x=>{
            if (x.instanceIds){
                x.links = Instances.find({_id: {$in: x.instanceIds}}).fetch()
            }
            return x
        })
console.log(res)
        return res
    }
});

Template.dashboard.events({
    'click .rejectJs' () {
        Meteor.call('owners.reject', this)
    },
    'click .approveJs' () {
        Meteor.call('owners.approve', this)
    },
});

Template.dashboard.onDestroyed(function() {})
