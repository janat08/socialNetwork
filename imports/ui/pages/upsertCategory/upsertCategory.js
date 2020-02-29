import './upsertCategory.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Categories } from '/imports/api/cols.js'
import r from 'ramda'

Template.upsertCategory.onCreated(function() {
    SubsCache.subscribe('categories.all')
    this.topSelect = new ReactiveVar()

    this.autorun((c) => {
        if (SubsCache.ready()) {
            this.topSelect.set(r.uniqBy((x => x.top), Categories.find().fetch()).map(x => x.top)[0])
            c.stop()
        }
    })
    
    this.autorun(()=>{
        const bot = Categories.find({ top: this.topSelect.get() }).fetch().map(x => x.bottom)[0]
        FlowRouter.go('App.upsertCategoryBt', { bottom: bot })
    })
});

Template.upsertCategory.helpers({
    category() {
        const bottom = FlowRouter.getParam('bottom')
        return Categories.findOne({ bottom }) || {}
    },
    topCats() {
        return r.uniqBy((x => x.top), Categories.find().fetch()).map(x => x.top)
    },
    bottomCats() {
        const { topSelect } = Template.instance()
        return Categories.find({ top: topSelect.get() }).fetch().map(x => x.bottom)
    },
});

Template.upsertCategory.events({
    'change .selectTopJs' (e, t) {
        t.topSelect.set(e.target.value)
    },
    'change .selectBotJs' (e,t){
        console.log(e.target.value)
        FlowRouter.go('App.upsertCategoryBt', { bottom: e.target.value })
    },
    'deleteJs' (e, t) {
        Meteor.call('category.remove', FlowRouter.getParam('bottom'))
    },
    'submit #upsertCategory' (e, t) {
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

        Meteor.call('categories.upsert', { oldBot: FlowRouter.getParam('bottom'), ...document }, (err, suc) => {
            if (suc) {
                FlowRouter.go('App.upsertCategoryBt', { bottom: bV })
            }
        })
    }
});

Template.upsertCategory.onDestroyed(function() {

})
