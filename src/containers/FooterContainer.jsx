import {store} from '../store'
import React from 'react'
import {Footer} from '../components/Footer'
import {api} from '../services'

export const FooterContainer = React.createClass({
  getInitialState: function() {
    var currentStore = store.getState()
  	return {
  		isOpenUnlock: false,
      activeAccount: 0,
      unlocked: false
  	}
  },
	componentWillMount: function() {
		var _this = this
    store.subscribe(function() {
      console.log('wee')
      var currentStore = store.getState()
      _this.setState({
        unlocked: currentStore.accountReducer.toJSON().unlocked
      })
    })
	},
  openUnlock: function() {
    var _this = this
    _this.setState({
      isOpenUnlock: true
    })
  },
  closeUnlock: function() {
    var _this = this
    _this.setState({
      isOpenUnlock: false
    })
  },
  unlockWithPass: function(acc, pass) {
    var _this = this
    console.log(acc)
    console.log(pass.value)
    api.unlock(acc, pass.value).then((res) => {
      console.log(res)
      _this.setState({
        isOpenUnlock: false
      })
    }).catch((err) => {
      console.log(err)
    })
  },
	render: function() {
		return (
      <Footer
        isOpenUnlock={this.state.isOpenUnlock}
        closeUnlock = {this.closeUnlock}
        unlockWithPass={this.unlockWithPass}
        openUnlock = {this.openUnlock} 
        unlocked={this.state.unlocked}
        activeAccount={this.state.activeAccount} />
		)
	}
})
