import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Friends } from '/imports/api/cols.js'
// Import needed templates
import '/imports/ui/layouts/body/body.js';
import '/imports/ui/pages/home/home.js'
import '/imports/ui/pages/requests/requests.js'
import '/imports/ui/pages/dashboard/dashboard.js'
import '/imports/ui/pages/findFriend/findFriend.js'
import '/imports/ui/pages/friendsWall/friendsWall.js'
import '/imports/ui/pages/post/post.js'
import '/imports/ui/pages/userInfo/userInfo.js'
import '/imports/ui/pages/not-found/not-found.js'
import '/imports/ui/pages/yourWall/yourWall.js'
import '/imports/ui/pages/upsertCategory/upsertCategory.js'
import '/imports/ui/pages/browseEvents/browseEvents.js'
import '/imports/ui/pages/createEvent/createEvent.js'
import '/imports/ui/pages/buyTickets/buyTickets.js'

window.SubsCache = new SubsCache(5, 10);

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'home' });
  },
});

FlowRouter.route('/dashboard', {
  name: 'App.dashboard',
  action() {
    BlazeLayout.render('App_body', { main: 'dashboard' });
  },
});

FlowRouter.route('/requests', {
  name: 'App.requests',
  action() {
    BlazeLayout.render('App_body', { main: 'requests' });
  },
});

FlowRouter.route('/findFriend', {
  name: 'App.findFriend',
  action() {
    BlazeLayout.render('App_body', { main: 'findFriend' });
  },
});

FlowRouter.route('/friendsWall/:friendId', {
  name: 'App.friendWall',
  action() {
    BlazeLayout.render('App_body', { main: 'friendsWall' });
  },
});

FlowRouter.route('/yourWall', {
  name: "App.yourWall",
  action(){
    BlazeLayout.render('App_body', { main: 'yourWall'})
  },
})

FlowRouter.route('/post/:friendId', {
  name: 'App.post',
  action() {
    BlazeLayout.render('App_body', { main: 'post' });
  },
});

FlowRouter.route('/userInfo', {
  name: 'App.userInfo',
  action() {
    BlazeLayout.render('App_body', { main: 'userInfo' });
  },
});

FlowRouter.route('/browseEvents', {
  name: 'App.userInfo',
  action() {
    BlazeLayout.render('App_body', { main: 'browseEvents' });
  },
});

FlowRouter.route('/createEvent', {
  name: 'App.userInfo',
  action() {
    BlazeLayout.render('App_body', { main: 'createEvent' });
  },
});


FlowRouter.route('/upsertCategory', {
  name: 'App.upsertCategory',
  action() {
    BlazeLayout.render('App_body', { main: 'upsertCategory' });
  },
});

FlowRouter.route('/upsertCategory/:bottom', {
  name: 'App.upsertCategoryBt',
  action() {
    BlazeLayout.render('App_body', { main: 'upsertCategory' });
  },
});

FlowRouter.route('/buy/:id', {
  name: 'App.upsertCategoryBt',
  action() {
    BlazeLayout.render('App_body', { main: 'buyTickets' });
  },
});


FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};

