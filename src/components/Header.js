import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Modal from 'react-modal'

export const Header = React.createClass({
  mixins: [PureRenderMixin],
	render: function() {
		console.log('header render active account: ' + this.props.activeAccount)
		console.log(this.props.options)
		return(
			<header className="toolbar toolbar-header" style={{flexDirection:'row' }}>
			    <img src={'logo.svg'} style={{height: 25, marginTop: 5, marginLeft: 5, marginRight: 0}} />
			  <div className="toolbar-actions" style={{marginLeft: 25, marginTop: -31}}>

			    <div className="btn-group">
			      <button className="btn btn-default">
			        <span className="icon icon-home"></span>
			      </button>
			      <button className="btn btn-default">
			        <span className="icon icon-download"></span>
			      </button>
			      <button className="btn btn-default">
			        <span className="icon icon-folder"></span>
			      </button>
			      <button className="btn btn-default">
			        <span className="icon icon-book"></span>
			      </button>
			    </div>

			    <button className="btn btn-default">
			      <span className="icon icon-network icon-text" style={{color: '#20BE6F'}}></span>
			      {this.props.online} Files Online
			    </button>
			    <button className="btn btn-default pull-right" onClick={this.props.openAccounts}>
			      <span className="icon icon-user pull-right"></span>
			    </button>
			    <Modal className="accounts-modal pull-right"
			      style={this.props.customModalStyles}
			      isOpen={this.props.isOpenAccounts}
			      onRequestClose={this.props.closeAccounts}>

				    <select id="accselect" ref="ctype" style={{height: 31, marginTop: -1}} className="pull-right" onChange={() => this.props.selectAcc(this.refs.ctype)}>
				      {this.props.options}
				    </select>
			    </Modal>

			    <button className="btn btn-default pull-right">
			      
			      Balance: Ξ{this.props.balance[0] + '.' + this.props.balance[1] + this.props.balance[2]}
			    </button>
			  </div>
			</header>
		)
	}
})