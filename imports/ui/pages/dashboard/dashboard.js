import './dashboard.html';
import { wall } from '/imports/api/queries.js'

Template.dashboard.onCreated(function() {
    this.autorun(() => {
        const params = {
            _id: Meteor.userId(),
            approved: false,
        }
        this.query = wall.clone( params );

        this.handle = this.query.subscribe(); // handle.ready()
    })
});

Template.dashboard.helpers({
    posts(){
        const templ = Template.instance()
        const {query, handle} = templ
        const res = query.fetch()[0].wall
                console.log(res, query.fetch())

        return res
    }
});

Template.dashboard.events({

});

Template.dashboard.onDestroyed(function() {})
