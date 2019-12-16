import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '/imports/ui/layouts/body/body.js';
import '/imports/ui/pages/home/home.js'
import '/imports/ui/pages/requests/requests.js'
import '/imports/ui/pages/friends/friends.js'
import '/imports/ui/pages/dashboard/dashboard.js'
import '/imports/ui/pages/findFriend/findFriend.js'
import '/imports/ui/pages/friendsWall/friendsWall.js'
import '/imports/ui/pages/post/post.js'
import '/imports/ui/pages/not-found/not-found.js'


// window.SubsCache = new SubsCache(5, 10);


// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.auctions',
  action() {
    BlazeLayout.render('App_body', { main: 'home' });
  },
});
FlowRouter.route('/dashboard', {
  name: 'App.auctions',
  action() {
    BlazeLayout.render('App_body', { main: 'dashboard' });
  },
});

FlowRouter.route('/requests', {
  name: 'App.auctions',
  action() {
    BlazeLayout.render('App_body', { main: 'requests' });
  },
});

FlowRouter.route('/friends', {
  name: 'App.createAuction',
  action() {
    BlazeLayout.render('App_body', { main: 'friends' });
  },
});

FlowRouter.route('/findFriend', {
  name: 'App.createAuction',
  action() {
    BlazeLayout.render('App_body', { main: 'findFriend' });
  },
});

FlowRouter.route('/friendsWall/:friendId', {
  name: 'App.auction',
  action() {
    BlazeLayout.render('App_body', { main: 'friendsWall' });
  },
});

FlowRouter.route('/post/:friendId', {
  name: 'App.auction',
  action() {
    BlazeLayout.render('App_body', { main: 'post' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
