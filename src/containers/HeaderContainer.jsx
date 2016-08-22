import {store} from '../store'
import React from 'react'
import {Header} from '../components/Header'
import {api} from '../services'

var accs = []

export const HeaderContainer = React.createClass({
  getInitialState: function() {
  	const customStyles = {
  		overlay: {
  			backgroundColor: 'rgba(0, 0, 0, 0.0)'
  		},
  		content: {
  			backgound: '#000'
  		}
  	}
  	return {
  		balance: 0,
  		activeAccount: 0,
  		accounts: [],
  		isOpenAccounts: false,
  		customModalStyles: customStyles
  	}
  },
	componentWillMount: function() {
		var _this = this

		store.subscribe(function() {
			console.log('wee')
      console.log(_this.state.activeAccount)
			var currentStore = store.getState()
      console.log(currentStore)
			_this.setState({
				balance: currentStore.accountReducer.toJSON().balance,
				activeAccount: currentStore.accountReducer.toJSON().activeAccount,
			})
		})
    _this.renderAccounts()
    const bal = api.getBalance(this.state.activeAccount)
	},
  renderAccounts: function() {
    api.getAccounts().then((res) => {
      let rand
      for (var i = 0; i < res.length; i++) {
        rand = Math.floor(Math.random()*100000000000000000)
        if (i == this.state.activeAccount) {
          accs.push(<option key={rand} value={i} defaultValue="selected">{res[i]}</option>)
        } else {
          accs.push(<option key={rand} value={i}>{res[i]}</option>)
        }
      }
      this.setState({
        accounts: accs
      })
    })
  },
  openAccounts: function() {
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
    console.log(refs.value)
    var _this = this
    api.setAccount(refs.value)
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
        selectAcc={this.selectAcc} />
		)
	}
})
