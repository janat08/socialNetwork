import FriendRequests from './friendRequests/collection'
import Users from './users/collection'
import Posts from './posts/collection'
import Owners from './owners/collection'
import {Instances, Events, Tickets} from './events/collection'
import Categories from './categories/collection'
import {ImagesFiles, ImagesCollection} from './images/images.js'
import Mail from './mail/collection'

const friendTypes = ['friends', 'family', 'besties', 'colleague']

export {Posts, Users, Owners, FriendRequests, ImagesFiles, ImagesCollection,
    friendTypes, Categories, Events, Instances, Tickets, Mail}