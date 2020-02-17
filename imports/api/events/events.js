import { Categories, Events } from '../cols.js'

Meteor.methods({
    "events.insert" ({top, bottom, ...rest}) {
        if (Categories.findOne({top, bottom})) throw new Meteor.Error('category non-existent')
          Events.insert({top, bottom, ...rest})
    },
})
