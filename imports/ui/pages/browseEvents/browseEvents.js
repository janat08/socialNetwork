import './browseEvents.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Categories, Events, Instances } from '/imports/api/cols.js'
import r from 'ramda'
import flatpickr from "flatpickr";
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment'
import '/imports/ui/components/imageShow/imageShow.js'

var getNumber = (function() {
    var previous = NaN;
    return function() {
        var min = 0;
        var max = 4 + (!isNaN(previous) ? -1 : 0);
        var value = Math.floor(Math.random() * (max - min + 1)) + min;
        if (value >= previous) {
            value += 1;
        }
        previous = value;
        return value;
    };
})();

Template.browseEvents.onCreated(function() {
    SubsCache.subscribe('events.all')
    SubsCache.subscribe('instances.all')
    SubsCache.subscribe('categories.all')
    SubsCache.subscribe('images.all')
    this.gen = getNumber
    this.timeS = new Date()
    this.timeE = moment().add(3, 'months').toDate()
    this.timeCha = new ReactiveVar(this.get())
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

Template.browseEvents.helpers({
    topCats() {
        return r.uniqBy((x => x.top), Categories.find().fetch()).map(x => x.top)
    },
    bottomCats() {
        const { topSelect } = Template.instance()
        return Categories.find({ top: topSelect.get() }).fetch().map(x => x.bottom)
    },
    events() {
        const { topSel, botSel, timeS, timeE, timeCha } = Template.instance()
        const t = topSel.get()
        const b = botSel.get()
        timeCha.get()
        const query = {
            $or: [{
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
            ],
            publicity: true,
        }
        Object.assign(query, { totalStart: { $lte: timeE }, totalEnd: { $gte: timeS } })
        
        return Instances.find(query)
    }
});

Template.browseEvents.events({
    'change .picker' (ev, templ) {
        templ.selected = ev.target.value
        templ.timeCha.set(templ.gen())
    },
    'change .pickerEnd' (ev, templ) {
        templ.selected = ev.target.value
        templ.timeCha.set(templ.gen())
    },
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

Template.browseEvents.onRendered(function() {
    // $(".mapJs").geocomplete()
    const instance = this
    flatpickr(instance.find('.picker'), { defaultDate: this.timeS });
    flatpickr(instance.find('.pickerEnd'), { defaultDate: this.timeE });
})
