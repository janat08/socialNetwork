import { ImagesFiles } from '/imports/api/cols.js';
import './imageShow.html'
Template.imageShow.onCreated(function(){
    SubsCache.subscribe('images.all')
})

Template.imageShow.helpers({
  images(){
    if (typeof this == 'object'){
      return Object.assign(ImagesFiles.findOne(this.image), {class: this.class})
    }
    return ImagesFiles.findOne(this+"")
  },
})
