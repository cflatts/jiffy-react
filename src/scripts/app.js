import React from 'react'
import ReactDOM from 'react-dom'
import Backbone from 'backbone'

import AppView from './AppView.js'

// ?q=funny+cat&api+key='

const app = function() {

	var GifCollection = Backbone.Collection.extend ({
        url:'http://api.giphy.com/v1/gifs/search',
        _key: 'dc6zaTOxFJmzC',


        parse: function(apiResponse) { // console log the new instance of the collection at the end. See that the data objects are returned as an array on the data property
            // console.log(apiResponse)
            return apiResponse.data // .data is the property where the data is being held on the apiResponse
        }
    })




    var GifRoutes = Backbone.Router.extend ({
        routes: {
            'search/:query': '_handleSearch',
            'home': 'goHome',
            '*catchall': 'routeHome'
        },

        initialize: function () {
            Backbone.history.start()
        },

        _handleSearch: function (query) {
            var gifColl = new GifCollection // new instance of the collection
            gifColl.fetch ({
                data: {
                    api_key: gifColl._key,
                    q: query
                }
            })
            //.then(function () {console.log(gifColl)
            //  log the collection and find where the data is, once parsed the data becomes an array of Backbone models on the models property of the collection
            // })
            ReactDOM.render(<AppView collection = {gifColl} />, document.querySelector('.container')) // passes gifColl onto the props of AppView and then renders it into the HTML element .container (since we removed .then it does not wait for the data to sync, we will set up a listener in React)
        }

    })

    new GifRoutes ()
}

app()