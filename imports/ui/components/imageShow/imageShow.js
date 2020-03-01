import { ImagesFiles } from '/imports/api/cols.js';
import './imageShow.html'
Template.imageShow.onCreated(function(){
    SubsCache.subscribe('images.all')
})

Template.imageShow.helpers({
  images(){
    var image
    if (typeof this == 'object'){
      Object.assign(image, ImagesFiles.findOne(this.image), {class: this.class})
    } else {
      image = ImagesFiles.findOne(this+"")
    }
    return image
  },
})
