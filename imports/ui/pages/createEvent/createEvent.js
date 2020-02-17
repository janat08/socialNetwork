import './createEvent.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Categories } from '/imports/api/cols.js'
import r from 'ramda'

Template.createEvent.onCreated(function() {
    SubsCache.subscribe('categories.all')
    this.topSelect = new ReactiveVar()
    this.autorun((c) => {
        if (SubsCache.ready()) {
            this.topSelect.set(r.uniqBy((x => x.top), Categories.find().fetch()).map(x => x.top)[0])
            c.stop()
        }
    })
});

Template.createEvent.helpers({
    topCats() {
        return r.uniqBy((x => x.top), Categories.find().fetch()).map(x => x.top)
    },
    bottomCats() {
        const { topSelect } = Template.instance()
        return Categories.find({ top: topSelect.get() }).fetch().map(x => x.bottom)
    }
});

Template.createEvent.events({
    'change .selectTopJs' (e, t) {
        t.topSelect.set(e.target.value)
    },
    'submit #post' (e, t) {
        e.preventDefault();
        const target = e.target;

        const {
            top: { value: tV },
            bottom: { value: bV },
        } = target

        var document = {
            top: tV,
            bottom: bV
        }

        const { top, bottom } = document

        const exists = Categories.findOne({ top, bottom })

        if (exists) {
            Meteor.call('events.create', { ...document }, (err, suc) => {
                // if (suc) {
                //     FlowRouter.go('App.upsertCategoryBt', { bottom: bV })
                // }
            })
        }

    }
});

Template.createEvent.onDestroyed(function() {})
