import './createEvent.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Categories, Instances, ImagesFiles } from '/imports/api/cols.js'
import r from 'ramda'
import moment from 'moment'
import flatpickr from "flatpickr";
import 'flatpickr/dist/flatpickr.css';

let isPast = (date) => {
  let today = moment().format();
  return moment(today).isAfter(date);
};

Template.createEvent.onCreated(function() {
  SubsCache.subscribe('categories.all')
  SubsCache.subscribe('instances.all')
  SubsCache.subscribe('events.all')
  SubsCache.subscribe('images.all')
  Meteor.call('events.start', (err, res) => {
    if (err) {
      alert('error, plz reload the page, or youre offline')
    }
    this._id = res
    Session.set('eventId', this._id)
  })
  this.currentUpload = new ReactiveArray()
  //meant to cause reactivity on object updates in current upload
  this.insertedUploads = new ReactiveVar(0)
  //used to assign ids to files, so that there're unique ids between consequtive upload batches
  this.numberOfRuns = 0
  this.frontCover = new ReactiveVar()

  this.topSelect1 = new ReactiveVar()
  this.topSelect2 = new ReactiveVar()
  this.topSelect3 = new ReactiveVar()
  this.publicity = new ReactiveVar(true)
  this.eventType = new ReactiveVar()
  this.autorun((c) => {
    if (SubsCache.ready()) {
      this.topSelect1.set(r.uniqBy((x => x.top), Categories.find().fetch()).map(x => x.top)[0])
      this.topSelect2.set(r.uniqBy((x => x.top), Categories.find().fetch()).map(x => x.top)[0])
      this.topSelect3.set(r.uniqBy((x => x.top), Categories.find().fetch()).map(x => x.top)[0])
      c.stop()
    }
  })
});

Template.createEvent.onRendered(function() {
  $('#eventsCalendar').fullCalendar({
    events(start, end, timezone, callback) {
      let data = Instances.find({ eventId: Session.get('eventId') }).fetch().map((event) => {
        event.editable = !isPast(event.start);
        return event;
      });

      if (data) {
        callback(data);
      }
    },
    eventRender(event, element) {
      element.find('.fc-content').html(
        `
        <p class="guest-count">${ event.startTime }-${ event.endTime }</p>
        `
      );
    },
    dayClick(date) {
      Session.set('eventModal', { type: 'add', date: date.format() });
      $('#add-edit-event-modal').modal('show');
    },
    eventClick(event) {
      Session.set('eventModal', { type: 'edit', event: event._id });
      $('#add-edit-event-modal').modal('show');
    }

  })
  Tracker.autorun((c) => {
    Instances.find({ eventId: this._id }).fetch();
    $('#eventsCalendar').fullCalendar('refetchEvents');
  });
  this.autorun(() => {
    if (Session.get('googleApiLoaded')) {
      $(".geocomplete").geocomplete({
        details: 'form',
        map: '.map_canvas',
        // types: ['geocode']
      })
    }
  })
});

Template.createEvent.helpers({
  currentUpload() {
    //meant for object reactivity
    Template.instance().insertedUploads.get()
    const curUpload = Template.instance().currentUpload.list()
    const ids = curUpload.filter(x => x.doc).map(x => x.doc._id)
    const uId = Meteor.userId()
    const query = [{ _id: { $in: ids } }]
    if (uId) query.push({ "meta.eventId": Session.get('eventId') })
    return ImagesFiles.find({ $or: query }).each().concat(curUpload.filter(x => !x.doc));
  },
  isFrontCover(ind) {
    const t = Template.instance()
    if (!t.frontCover.get()) {
      t.frontCover.set(this._id)
    }
    return ind == t.frontCover.get() ? 'checked' : ''
  },
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
  templateType() {
    return Template.instance().publicity.get()
  },
  eventType() {
    return Template.instance().eventType.get() == "constant"
  },
});

Template.createEvent.events({
  'click .jsRemovePic' (e, templ) {
    console.log(this, "removing")
    Meteor.call('images.remove', this._id)
    const st = templ.currentUpload
    st.splice(st.findIndex(x => x.doc._id == this._id), 1)
  },
  'change #fileInput' (e, template) {
    const st = template.currentUpload
    const stRuns = template.numberOfRuns + ""
    template.numberOfRuns += 1
    window.ab = template.currentUpload
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      Array.from(e.currentTarget.files).forEach((x, i) => {
        // We upload only one file, in case
        // multiple files were selected
        const upload = ImagesFiles.insert({
          file: e.currentTarget.files[i],
          streams: 'dynamic',
          chunkSize: 'dynamic',
          meta: {
            uploader: Meteor.userId(),
            eventId: template._id
          },
        }, false);

        const itemId = stRuns + i

        upload.on('start', function() {
          st.push({ upload: this, _id: itemId })
        });

        upload.on('end', function(error, fileObj) {
          if (error) {
            alert('Error during upload: ' + error);
          }
          else {
            // alert('File "' + fileObj.name + '" successfully uploaded');
          }
          st[st.findIndex(x => x._id == itemId)].doc = fileObj
          template.insertedUploads.set(stRuns + i)
        });

        upload.start();
      })

    }
  },
  'click .pickFrontCoverJs' (e, t) {
    t.frontCover.set(this._id)
  },
  'change input:radio[name=eventType]' (e, t) {
    t.eventType.set(e.target.value)
  },
  'change input:radio[name=publicity]' (e, t) {
    t.publicity.set(!!(e.target.value * 1))
  },
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
      // top1: tV1,
      // bottom1: bV1,
      // top2: tV2,
      // bottom2: bV2,
      // top3: tV3,
      // bottom3: bV3,
      type: t.publicity.get(),
      frontCover: t.frontCover.get(),
      images: t.currentUpload.array().map(x => x.doc._id),
      _id: t._id
    }

    $.each($('#post').serializeArray(), function(i, field) {
      document[field.name] = field.value;
    });

    //bugs out otherwise; if images are not declared here
    document.images = t.currentUpload.array().map(x => x.doc._id),
      document.publicity = !!(document.publicity * 1)
    console.log(document)
    Meteor.call('events.upsert', { ...document }, (err, suc) => {
      console.log(suc, err)
      if (suc) {
        // FlowRouter.go('App.upsertCategoryBt', { bottom: bV })
      }
    })
  }
});

Template.createEvent.onDestroyed(function() {})


Template.addEditEventModal.onRendered(function() {
  const instance = this
  flatpickr(instance.find('.picker'), { noCalendar: true, enableTime: true, defaultDate: this.timeS });
  flatpickr(instance.find('.pickerEnd'), { noCalendar: true, enableTime: true, defaultDate: this.timeE });
})

Template.addEditEventModal.helpers({
  modalType(type) {
    let eventModal = Session.get('eventModal');
    if (eventModal) {
      return eventModal.type === type;
    }
  },
  modalLabel() {
    let eventModal = Session.get('eventModal');

    if (eventModal) {
      return {
        button: eventModal.type === 'edit' ? 'Edit' : 'Add',
        label: eventModal.type === 'edit' ? 'Edit' : 'Add an'
      };
    }
  },
  selected(v1, v2) {
    return v1 === v2;
  },
  event() {
    let eventModal = Session.get('eventModal');

    if (eventModal) {
      return eventModal.type === 'edit' ? Instances.findOne(eventModal.event) : {
        start: eventModal.date,
        end: eventModal.date
      };
    }
  }
});

let closeModal = () => {
  $('#add-edit-event-modal').modal('hide');
  $('.modal-backdrop').fadeOut();
};

Template.addEditEventModal.events({
  'submit #add-edit-event-form' (event, template) {
    event.preventDefault();

    let eventModal = Session.get('eventModal'),
      submitType = eventModal.type === 'edit' ? 'instance.edit' : 'instance.add',
      eventItem = {
        startTime: template.find('[name="picker"]').value,
        endTime: template.find('[name="pickerEnd"]').value,
        start: template.find('[name="start"]').value,
        end: template.find('[name="end"]').value,
        eventId: Session.get('eventId')
      };

    if (submitType === 'instance.edit') {
      eventItem._id = eventModal.event;
    }
    eventItem.totalStart = moment(eventItem.start).hour(eventItem.startTime.split(":")[0]).minute(eventItem.startTime.split(":")[1]).toDate()
    eventItem.totalEnd = moment(eventItem.end).hour(eventItem.endTime.split(":")[0]).minute(eventItem.endTime.split(":")[1]).toDate()

    Meteor.call(submitType, eventItem, (error) => {
      if (error) {
        console.log(error)
        // Bert.alert( error.reason, 'danger' );
      }
      else {
        // Bert.alert( `Event ${ eventModal.type }ed!`, 'success' );
        closeModal();
      }
    });
  },
  'click .delete-event' (event, template) {
    let eventModal = Session.get('eventModal');
    if (confirm('Are you sure? This is permanent.')) {
      Meteor.call('instance.remove', eventModal.event, (error) => {
        if (error) {
          //   Bert.alert( error.reason, 'danger' );
        }
        else {
          //   Bert.alert( 'Event deleted!', 'success' );
          closeModal();
        }
      });
    }
  }
});
