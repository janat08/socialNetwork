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

    // this.autorun((comp) => {
    //     const user = Users.findOne(Meteor.userId())
    //     if (user && user.profile && user.profile.avatar) {
    //         const avatar = { doc: { _id: ImagesFiles.findOne(user.profile.avatar) } }
            
    //         this.currentUpload.push(avatar)
    //         comp.stop()
    //         console.log(ImagesFiles.findOne(user.profile.avatar))
    //     }
    // })
});

Template.userInfo.helpers({
    user() {
        return Users.findOne(Meteor.userId())
    },
    currentUpload() {
        //meant for object reactivity
        Template.instance().insertedUploads.get()
        const curUpload = Template.instance().currentUpload.list()
        const ids = curUpload.filter(x=>x.doc).map(x=>x.doc._id)
        const uId = Meteor.userId()
        const query = [{_id: {$in: ids}}]
        if (uId) query.push({"meta.userId": uId})
        console.log(query)
        return ImagesFiles.find({$or: query}).each().concat(curUpload.filter(x=>!x.doc));
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
    'change #fileInput' (e, template) {
        console.log(e.currentTarget.files)
        const uploadPush = template.currentUpload.push
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
});

Template.userInfo.onDestroyed(function() {})
