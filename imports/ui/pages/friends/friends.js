import './friends.html';
import { friends } from '/imports/api/queries.js'
import {Posts} from '/imports/api/cols.js'

Template.friends.onCreated(function() {
    this.autorun(() => {
        const params = {
            _id: Meteor.userId(),
        }
        this.query = friends.clone({ params });

        this.handle = this.query.subscribe(); // handle.ready()
    })
});

Template.friends.helpers({
    posts() {
        const templ = Template.instance()
        const { query, handle } = templ
        return query.fetch().friends.reduce((a,x)=>{
            a[x.type] = x
            return a
        }, {})
    }
});

Template.friends.events({

});

Template.friends.onDestroyed(function() {})
