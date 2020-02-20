import './browseEvents.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Categories, Events } from '/imports/api/cols.js'
import r from 'ramda'

Template.browseEvents.onCreated(function() {
    SubsCache.subscribe('events.all')
    SubsCache.subscribe('categories.all')
    this.topSelect = new ReactiveVar()
    this.topSel = new ReactiveVar()
    this.botSel = new ReactiveVar()
    this.autorun((c) => {
        if (SubsCache.ready()) {
            this.topSelect.set(r.uniqBy((x => x.top), Categories.find().fetch()).map(x => x.top)[0])
            c.stop()
        }
    })
});

Template.browseEvents.onRendered(function() {
    $(".mapJs").geocomplete()
});

Template.browseEvents.helpers({
    topCats() {
        return r.uniqBy((x => x.top), Categories.find().fetch()).map(x => x.top)
    },
    bottomCats() {
        const { topSelect } = Template.instance()
        return Categories.find({ top: topSelect.get() }).fetch().map(x => x.bottom)
    },
    events(){
        const { topSel, botSel } = Template.instance()
        const t = topSel.get()
        const b = botSel.get()
        const query = {
            $or: [
                {
                    top1: t,
                    bottom1: b,
                },
                {
                    top2: t,
                    bottom2: b,
                },
                {
                    top3: t,
                    bottom3: b,
                },
                ]
        }
        console.log(t,b, query)
        return Events.find(query)
    }
});

Template.browseEvents.events({
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

        t.topSel.set(tV)
        t.botSel.set(bV)
    }
});

Template.browseEvents.onDestroyed(function() {})
