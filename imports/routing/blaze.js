import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Friends } from '/imports/api/cols.js'
// Import needed templates
import '/imports/ui/layouts/body/body.js';
import '/imports/ui/pages/home/home.js'
import '/imports/ui/pages/requests/requests.js'
import '/imports/ui/pages/newDash/dashboard.js'
import '/imports/ui/pages/findFriend/findFriend.js'
import '/imports/ui/pages/friendsWall/friendsWall.js'
import '/imports/ui/pages/post/post.js'
import '/imports/ui/pages/userInfo/userInfo.js'
import '/imports/ui/pages/not-found/not-found.js'

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

FlowRouter.route('/sentRequests', {
  name: 'App.userInfo',
  action() {
    BlazeLayout.render('App_body', { main: 'sentRequests' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};

