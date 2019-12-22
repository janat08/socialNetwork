import FriendRequests from './friendRequests/collection'
import Friends from './friends/collection'
import Users from './users/collection'
import Posts from './posts/collection'
import Owners from './owners/collection'
import {ImagesFiles, ImagesCollection} from './images/images.js'

const friendTypes = ['friends', 'family', 'besties', 'colleague']

export {Posts, Users, Owners, Friends, FriendRequests, ImagesFiles, ImagesCollection,
    friendTypes
}