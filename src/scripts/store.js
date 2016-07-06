import Backbone from 'backbone'


var STORE = {
    focusId: '',
    setFocusId: function(id) {
        this.focusId = id
        Backbone.Events.trigger('newId',id)
    }
}

export default STORE