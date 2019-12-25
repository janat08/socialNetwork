import './dashboard.html';
import { Posts, Owners, Users } from '/imports/api/cols.js'
// import data from './data.json'
// import './polaroid-gallery.js'
import './polaroid-gallery.css'
import sett from './data.json'

var data = sett

var dataSize = {};
var dataLength = 0;
var currentData = null;
var navbarHeight = 60;
var resizeTimeout = null;
var deleted = {}
var currentIndex = 0

function polaroidGallery(data) {
    observe();
    setGallery(data)
    init()
    console.log(dataSize, dataLength, currentData, navbarHeight, resizeTimeout)
}

function setGallery(arr) {
    var out = "";
    var i;
    for (i = 0; i < arr.length; i++) {
        out += '<div class="photo" id="' + i + '"><div class="side side-front"><figure>' +
            '<img src="' + arr[i].name + '" alt="' + arr[i].name + '"/>' +
            '<figcaption>' + arr[i].caption + '</figcaption>' +
            '</figure></div><div class="side side-back"><div><p>' + arr[i].description + '</p></div></div></div>';
    }
    document.getElementById("gallery").innerHTML = out;
}

function observe() {
    var observeDOM = (function() {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
            eventListenerSupported = window.addEventListener;

        return function(obj, callback) {
            if (MutationObserver) {
                var obs = new MutationObserver(function(mutations, observer) {
                    if (mutations[0].addedNodes.length || mutations[0].removedNodes.length)
                        callback(mutations);
                });

                obs.observe(obj, { childList: true, subtree: false });
            }
            else if (eventListenerSupported) {
                obj.addEventListener('DOMNodeInserted', callback, false);
            }
        }
    })();

    observeDOM(document.getElementById('gallery'), function(mutations) {
        var gallery = [].slice.call(mutations[0].addedNodes);
        gallery.forEach(function(item) {
            var img = item.getElementsByTagName('img')[0];
            var fig = item.getElementsByTagName('figure')[0];
            var first = true;

            img.addEventListener('load', function() {
                item.style.height = (fig.offsetHeight).toString() + 'px';
                item.style.width = (fig.offsetWidth).toString() + 'px';

                dataSize[item.id] = { item: item, width: item.offsetWidth, height: img.offsetHeight };

                if (first) {
                    currentData = dataSize[item.id];
                    first = false;
                }

                dataLength++;

                item.addEventListener('click', function() {
                    if ((currentData != dataSize[item.id]) || (currentData == null)) {
                        select(dataSize[item.id]);
                        shuffleAll();
                    }
                    else {
                        item.classList.contains('flipped') === true ? item.classList.remove('flipped') : item.classList.add('flipped');
                    }
                });

                shuffle(dataSize[item.id]);
            })
        });
    });
}

function init() {
    navbarHeight = document.getElementById("nav").offsetHeight;
    navigation();

    window.addEventListener('resize', function() {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(function() {
            shuffleAll();
            if (currentData) {
                select(currentData);
            }
        }, 100);
    });
}

function select(data) {
    var scale = 1.8;
    currentIndex = data.item.id
    var x = (window.innerWidth - data.item.offsetWidth) / 2;
    var y = (window.innerHeight - navbarHeight - data.item.offsetHeight) / 2;

    data.item.style.zIndex = 999;
    data.item.style.WebkitTransform = 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ',' + scale + ')';
    data.item.style.mozTransform = 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ',' + scale + ')';
    data.item.style.msTransform = 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ',' + scale + ')';
    data.item.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ',' + scale + ')';

    currentData = data;
}

function shuffle(data) {
    var randomX = Math.random();
    var randomY = Math.random();
    var maxR = 45;
    var minR = -45;
    var rotRandomD = Math.random() * (maxR - minR) + minR;

    var x = Math.floor((window.innerWidth - data.item.offsetWidth) * randomX);
    var y = Math.floor((window.innerHeight - data.item.offsetHeight - navbarHeight) * randomY);

    data.item.style.zIndex = 1;
    data.item.style.WebkitTransform = 'translate(' + x + 'px,' + y + 'px) rotate(' + rotRandomD + 'deg)';
    data.item.style.mozTransform = 'translate(' + x + 'px,' + y + 'px) rotate(' + rotRandomD + 'deg)';
    data.item.style.msTransform = 'translate(' + x + 'px,' + y + 'px) rotate(' + rotRandomD + 'deg)';
    data.item.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + rotRandomD + 'deg)';
}

function shuffleAll() {
    for (var id in dataSize) {
        if (id != currentData.item.id) {
            shuffle(dataSize[id]);
        }
    }
}

function navigation() {
    var next = document.getElementById('next');
    var preview = document.getElementById('preview');

    next.addEventListener('click', function next() {
        var currentIndex = Number(currentData.item.id) + 1;
        if (currentIndex >= dataLength) {
            currentIndex = 0
        }
        if (deleted[currentIndex]) next()
        select(dataSize[currentIndex]);
        shuffleAll();
    });

    preview.addEventListener('click', function previous() {
        var currentIndex = Number(currentData.item.id) - 1;
        if (currentIndex < 0) {
            currentIndex = dataLength - 1
        }
        if (deleted[currentIndex]) previous()

        select(dataSize[currentIndex]);
        shuffleAll();
    })
}

Template.dashboard.onCreated(function() {
    this.autorun(() => {
        SubsCache.subscribe('posts.all')
        SubsCache.subscribe('owners.all')
        SubsCache.subscribe('users.all')
    })



});

Template.dashboard.onRendered(function() {
    this.autorun(() => {
        const { query, handle } = this
        const owners = Owners.find({ ownerId: Meteor.userId(), approved: false }).fetch()

        const res = Posts.find({
            _id: {
                $in: owners.map(x => x.postId)
            }
        }).fetch().map((x, i) => {
            var user = Users.findOne(x.authorId)
            x.caption = `From: ${user.profile.first} ${user.profile.last}, ` + x.title
            x.description = x.content
            x.name = "https://image.freepik.com/free-photo/image-human-brain_99433-298.jpg"
            return x
        })

        var a = {
            "name": "img/img02.jpg",
            "caption": "Amis",
            "description": "Le temps confirme l'amitié.<br> — Henri Lacordaire"
        }
        if (res.length) {
            polaroidGallery(res)
        }
    })
})

Template.dashboard.helpers({

});

Template.dashboard.events({
    'click .rejectJs' () {
        Meteor.call('owners.reject', this)
    },
    'click .approveJs' () {
        Meteor.call('owners.approve', this)
    },
    'click #delete': function deleteClick() {
        const prev = currentData
        currentIndex = Number(currentData.item.id) + 1;
        console.log(currentIndex, deleted[currentIndex], dataSize[currentIndex])
        if (typeof dataSize[currentIndex] == 'undefined') {
            currentIndex = 0
        }
        if (Object.keys(dataSize) == Object.keys(deleted)) return
        if (deleted[currentIndex]) deleteClick()

        select(dataSize[currentIndex]);
        shuffleAll();
        // prev.item.zIndex(-1)
        prev.item.remove()
        deleted[prev.item.id] = true
    }
});



Template.dashboard.onDestroyed(function() {})
