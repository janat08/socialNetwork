import './dashboard.html';
import { Posts, Owners, Users } from '/imports/api/cols.js'
// import data from './data.json'
import './polaroid-gallery.js'
import './polaroid-gallery.css'

Template.dashboard.onCreated(function() {
    this.autorun(() => {
        SubsCache.subscribe('posts.all')
        SubsCache.subscribe('owners.all')
        SubsCache.subscribe('users.all')

    })
});

Template.dashboard.onRendered(function(){
    console.log(polaroidGallery)
    //  new polaroidGallery("/data.json")
})

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
