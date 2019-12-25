import './userInfo.html';
import { FriendRequests, Users, ImagesFiles } from '/imports/api/cols.js'
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.userInfo.onCreated(function() {
    SubsCache.subscribe('users.all')
    SubsCache.subscribe('images.all')

    this.currentUpload = new ReactiveArray()
    //meant to cause reactivity on object updates in current upload
    this.insertedUploads = new ReactiveVar(0)
    //used to assign ids to files, so that there're unique ids between consequtive upload batches
    this.numberOfRuns = 0

    this.currentUpload1 = new ReactiveArray()
    //meant to cause reactivity on object updates in current upload
    this.insertedUploads1 = new ReactiveVar(0)
    //used to assign ids to files, so that there're unique ids between consequtive upload batches
    this.numberOfRuns1 = 0

});

Template.userInfo.helpers({
    user() {
        return Users.findOne(Meteor.userId())
    },
    currentUpload() {
        //meant for object reactivity
        Template.instance().insertedUploads.get()
        const curUpload = Template.instance().currentUpload.list()
        const ids = curUpload.filter(x => x.doc).map(x => x.doc._id)
        const uId = Meteor.userId()
        const query = [{ _id: { $in: ids } }]
        if (uId) query.push({ "meta.userId": uId })
        return ImagesFiles.find({ $or: query }).each().concat(curUpload.filter(x => !x.doc));
    },
    currentUpload1() {
        //meant for object reactivity
        Template.instance().insertedUploads1.get()
        const curUpload = Template.instance().currentUpload1.list()
        const ids = curUpload.filter(x => x.doc).map(x => x.doc._id)
        const uId = Meteor.userId()
        const query = [{ _id: { $in: ids } }]
        if (uId) query.push({ "meta.backgroundUserId": uId })
        return ImagesFiles.find({ $or: query }).each().concat(curUpload.filter(x => !x.doc));
    },
});

Template.userInfo.events({
    'submit #profile' (event, templ) {
        event.preventDefault();

        const target = event.target;
        const {
            last: { value: lV },
            first: { value: fV },
            startedWork: { value: swV },
            company: { value: cV },
            occupation: { value: oV },
            street: { value: sV },
            city: { value: ciV },
            country: { value: coV },
        } = target

        const images = templ.currentUpload
        const backgrounds = templ.currentUpload1
        var document = {
            first: fV,
            last: lV,
            startedWork: swV,
            company: cV,
            occupation: oV,
            street: sV,
            city: ciV,
            country: coV,
        }

        if (images[0]) {
            document.avatar = images[0].doc._id
        }
        if (backgrounds[0]) {
            document.background = backgrounds[0].doc._id
        }

        Meteor.call('users.updateProfile', document, (err, res) => {
            if (err) {
                alert(err)
            }
            else {
                alert('data saved')
                // FlowRouter.go('App.friends')
            }
        });
    },
    'click .jsRemovePic' (e, templ) {
        console.log(this, "removing")
        Meteor.call('images.remove', this._id)
        const st = templ.currentUpload
        st.splice(st.findIndex(x => x.doc._id == this._id), 1)
    },
    'click .jsRemovePic1' (e, templ) {
        console.log(this, "removing")
        Meteor.call('images.remove', this._id)
        const st = templ.currentUpload1
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
    'change #fileInput1' (e, template) {
        const st = template.currentUpload1
        const stRuns = template.numberOfRuns1 + ""
        template.numberOfRuns1 += 1
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
                    template.insertedUploads1.set(stRuns + i)
                });

                upload.start();
            })

        }
    },
});

Template.userInfo.onDestroyed(function() {})
