import {store} from '../store'
import React from 'react'
import {Header} from '../components/Header'
import {api} from '../services'

var accs = []
let currentStore

export const HeaderContainer = React.createClass({
  getInitialState: function() {
    currentStore = store.getState()
  	const customStyles = {
  		overlay: {
  			backgroundColor: 'rgba(0, 0, 0, 0.0)'
  		},
  		content: {
  			backgound: '#000'
  		}
  	}
  	return {
  		balance: currentStore.accountReducer.toJSON().balance,
  		activeAccount: currentStore.accountReducer.toJSON().activeAccount,
  		accounts: currentStore.accountReducer.toJSON().accounts,
  		isOpenAccounts: false,
  		customModalStyles: customStyles,
      options: [],
      online: 0
  	}
  },
	componentWillMount: function() {
		var _this = this

		store.subscribe(function() {
			console.log('header store subscribe triggered')
			currentStore = store.getState()
			_this.setState({
				balance: currentStore.accountReducer.toJSON().balance,
				activeAccount: currentStore.accountReducer.toJSON().activeAccount,
        online: currentStore.filesReducer.toJSON().online
			})
      console.log('rerendering accounts drop down')
      _this.renderAccounts()
		})
    console.log('rendering accounts 1st time')
    _this.renderAccounts()
    _this.selectAcc({value: 0})
	},
  renderAccounts: function() {
    var _this = this
    accs = []
    // console.log(_this.state.accounts)
    // console.log(accs)
    currentStore = store.getState()
    let rand
    //console.log(currentStore.accountReducer.toJSON().activeAccount)
    for (var i = 0; i < currentStore.accountReducer.toJSON().accounts.length; i++) {
      rand = Math.floor(Math.random()*100000000000000000)
      if (i == currentStore.accountReducer.toJSON().activeAccount) {
        accs.push(<option key={rand} value={i} selected="selected">{currentStore.accountReducer.toJSON().accounts[i]}</option>)
      } else {
        accs.push(<option key={rand} value={i}>{currentStore.accountReducer.toJSON().accounts[i]}</option>)
      }
    }
    //console.log(accs)

    _this.setState({
      options: accs
    })

  },
  openAccounts: function(test) {
    var _this = this
    _this.setState({
      isOpenAccounts: true
    })
  },
  closeAccounts: function() {
    var _this = this
    _this.setState({
      isOpenAccounts: false
    })
  },
  selectAcc: function(refs) {
    console.log('setting account to: ' + refs.value)
    var _this = this
    api.setAccount(refs.value)
    api.getBalance(refs.value)
    _this.setState({
      isOpenAccounts: false
    })
  },
	render: function() {
		return (
      <Header 
        balance={this.state.balance}
        accounts={this.state.accounts}
        activeAccount={this.state.activeAccount}
        openAccounts={this.openAccounts}
        closeAccounts={this.closeAccounts}
        isOpenAccounts={this.state.isOpenAccounts}
        customModalStyles={this.state.customModalStyles}
        selectAcc={this.selectAcc}
        options={this.state.options} 
        online = {this.state.online} />
		)
	}
})
