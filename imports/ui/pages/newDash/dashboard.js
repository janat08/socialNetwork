import './dashboard.html';
import { Posts, Owners, Users, ImagesFiles } from '/imports/api/cols.js'
import './polaroid-gallery.css'
import './jqueryui.1.12.1.js'
import './index.css'
// import sett from './data.json'
// var data = sett

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
}

function setGallery(arr) {
    var out = "";
    var i;
    for (i = 0; i < arr.length; i++) {
        out += '<div class="photo" id="' + i + '" data-id="' + arr[i]._id + '"><div class="side side-front"><figure>' +
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
    this.autorun((comp) => {
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
            x.name = "https://upload.wikimedia.org/wikipedia/commons/6/6c/No_image_3x4.svg"
            if (x.imageIds) {
                const image = ImagesFiles.findOne(x.imageIds[0])
                x.name = image.name
            }
            return x
        })

        if (res.length) {
            polaroidGallery(res)
            $(".photo").draggable();
            $("#delete").droppable({
                drop: function(event, ui) {
                    const _id = deleteClick()
                    Meteor.call('owners.reject', { _id })
                }
            });
            $("#approve").droppable({
                drop: function(event, ui) {
                    const _id = deleteClick()
                    Meteor.call('owners.approve', { _id })
                }
            });
            comp.stop()
        }
    })
})

Template.dashboard.helpers({

});

Template.dashboard.events({
    'click .rejectJs' () {
        const _id = deleteClick()
        Meteor.call('owners.reject', { _id })
    },
    'click .approveJs' () {
        const _id = deleteClick()
        Meteor.call('owners.approve', { _id })
    },
    'click #delete': deleteClick
});

function deleteClick() {
    const prev = currentData
    currentIndex = currentIndex * 1 + 1;
    if (typeof dataSize[currentIndex] == 'undefined') {
        currentIndex = 0
    }
    if (Object.keys(dataSize).length == Object.keys(deleted).length) return
    if (!!deleted[currentIndex]) return deleteClick()
    const id = $(prev.item).data('id')
    select(dataSize[currentIndex]);
    shuffleAll();
    prev.item.remove()
    deleted[prev.item.id] = true

    return id
}

Template.dashboard.onDestroyed(function() {})
