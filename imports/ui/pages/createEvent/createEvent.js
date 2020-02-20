import './createEvent.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Categories } from '/imports/api/cols.js'
import r from 'ramda'

Template.createEvent.onCreated(function() {
    SubsCache.subscribe('categories.all')
    this.topSelect1 = new ReactiveVar()
    this.topSelect2 = new ReactiveVar()
    this.topSelect3 = new ReactiveVar()
    this.autorun((c) => {
        if (SubsCache.ready()) {
            this.topSelect1.set(r.uniqBy((x => x.top), Categories.find().fetch()).map(x => x.top)[0])
            this.topSelect2.set(r.uniqBy((x => x.top), Categories.find().fetch()).map(x => x.top)[0])
            this.topSelect3.set(r.uniqBy((x => x.top), Categories.find().fetch()).map(x => x.top)[0])
            c.stop()
        }
    })
});

Template.createEvent.helpers({
    topCats() {
        return r.uniqBy((x => x.top), Categories.find().fetch()).map(x => x.top)
    },
    bottomCats1() {
        const { topSelect1 } = Template.instance()
        return Categories.find({ top: topSelect1.get() }).fetch().map(x => x.bottom)
    },
    bottomCats2() {
        const { topSelect2 } = Template.instance()
        return Categories.find({ top: topSelect2.get() }).fetch().map(x => x.bottom)
    },
    bottomCats3() {
        const { topSelect3 } = Template.instance()
        return Categories.find({ top: topSelect3.get() }).fetch().map(x => x.bottom)
    },
});

Template.createEvent.events({
    'change .selectTopJs1' (e, t) {
        t.topSelect1.set(e.target.value)
    },
    'change .selectTopJs2' (e, t) {
        t.topSelect2.set(e.target.value)
    },
    'change .selectTopJs3' (e, t) {
        t.topSelect3.set(e.target.value)
    },
    'submit #post' (e, t) {
        e.preventDefault();
        const target = e.target;

        const {
            top1: { value: tV1 },
            bottom1: { value: bV1 },
            top2: { value: tV2 },
            bottom2: { value: bV2 },
            top3: { value: tV3 },
            bottom3: { value: bV3 },
        } = target

        var document = {
            top1: tV1,
            bottom1: bV1,
            top2: tV2,
            bottom2: bV2,
            top3: tV3,
            bottom3: bV3,
        }

        Meteor.call('events.upsert', { ...document }, (err, suc) => {
            console.log(suc, err)
            if (suc) {
                // FlowRouter.go('App.upsertCategoryBt', { bottom: bV })
            }
        })

    }
});

Template.createEvent.onDestroyed(function() {})
