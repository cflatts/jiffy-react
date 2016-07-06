import React from 'react'
import ReactDOM from 'react-dom'
import Backbone from 'backbone'
import STORE from './store'

const AppView = React.createClass ({

    getInitialState: function() {
        return {
            coll: this.props.collection, //returns the object that is the state of the collection (becomes this.state.gifColl) comes from the new instance of the collection assigned to the collection of the AppView in the router, publishes sync event when data is ready, sets up PubSub event

            focus: '' //managed from the AppView so that only one element has focus at a time (focus means which image will be large in this app)
        }

    },

    componentWillMount: function () {
        // console.log('mounting') //only mounts once per page mount. We aren't causing it to mount, it is just a function that is invoked at a particular moment in the life cycle

        this.state.coll.on('sync', () => { // () is anonymous function syntax used in fat arrow function
            this.setState({
                coll: this.state.coll
            }) //call set state and pass in the part that we want to change
        })

        Backbone.Events.on('newId', (payload) => { //the input is the payload (id#) that we sent in with the trigger event
            this.setState({
                focus: payload //assign payload to the focus property
            })
        })
    },

    render: function() {
        //console.log(this.props) this.props is an array of backbone models on the model property of the object

        // console.log(this.state.coll.models) // an array of Backbone models

        // console.log(this.state.focus) //this logs the id of the gif when clicked (confirmation that the system is working)
        var overlayStyle = {
            display: 'none'
        }

        if (this.state.focus) {
            overlayStyle.display = 'block'
        }

        return (
            <div className = 'appContainer'>
                <Header />
                <GifContainer gifId = {this.state.focus} gifColl = {this.state.coll} /> {/*this gifColl is not the same as the gifColl in the router*/}
                {/*<div style={overlayStyle} id="overlay"></div>*/}
            </div>
        )
    }
})

const Header = React.createClass ({
    _searchGifs: function (evt) { //sets up a function that takes an event as input. If the event is the pressing of keycode 13 (enter key) then it will change the hash to '#search/search_input'
        if(evt.keyCode === 13) {
            location.hash = 'search/' + evt.target.value
            evt.target.value = ''
        }
    },

    render: function () {
        return (
            <div className = 'mainHeader'>
                <h1>Giffy App</h1>
                <input type = 'text' placeholder = 'search' onKeyDown = {this._searchGifs}/> {/*sets up an input bar that will run the _searchGifs function on a key press*/}
            </div>
            )
    }
})


const GifContainer = React.createClass ({

    _singleGif: function(m) {
        return <Gif gifId = {this.props.gifId} model = {m} key = {m.cid} />
        {/* each individual component will have a backbone model on their props (gifModel property), key is for ease of comparison*/}
    },

    render: function () {
        // console.log(this.props) //shows that the object with with array of Backbone models on the models property has been passed down to the GifContainer
        return (
            <div className = 'gifContainer'>
                {this.props.gifColl.map(this._singleGif)} {/*map runs through each model in the array uses each one as the input for the _singleGif callback function*/}
            </div>
        )
    }
})

const Gif = React.createClass ({
    _assignId:function () {
        STORE.setFocusId(this.props.model.id) //when this method is invoked it uses the Backbone event called trigger to change the state, second argument is the unique id ('payload' that is being sent along)
    },

    render:function () {
        // console.log(this.props.model.id) //show each unique id# of the gif

        // console.log(this.props.gifId) //shows that the id has returned from the parent AppView and is on the gifId property of the props

        var focusClass = 'oneGif', //regular clas assignment for all gifs
            imgTag = <img src = {this.props.model.get('images').downsized.url} />

        if(this.props.model.id === STORE.focusId) {
            focusClass = 'active oneGif' //if it is the gif that we clicked on then the class name become active and oneGif
            imgTag =  <img src = {this.props.model.get('images').original.url} />

        }

        return (
            <div className = {focusClass} onClick = {this._assignId}> {/*when the div is clicked it will run the _assignId method, also assigns focusClass as the class name on this div*/}
                {imgTag}
            </div>
            )
    }
})




export default AppView