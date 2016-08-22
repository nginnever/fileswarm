import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Modal from 'react-modal'

export const Footer = React.createClass({
  mixins: [PureRenderMixin],
	render: function() {
		console.log('unlocked: ' + this.props.unlocked)
		return(
			<footer className="toolbar toolbar-footer">
			  <div className="toolbar-actions">
			    <button className="btn btn-default">
			      <span className="icon icon-stop"></span>
			      &nbsp; Stop Seeding
			    </button>
			    <button className={this.props.unlocked ? "btn btn-primary pull-right" : "btn btn-warning pull-right" } onClick={this.props.openUnlock}>
			      <Modal 
			        className="my-modal pull-right"
			        isOpen={this.props.isOpenUnlock}
			        onRequestClose={this.props.closeUnlock}>
			          <form name="pass" ref="getPass" onSubmit={event => event.preventDefault()}>
			            <fieldset className="form-group">
			              <label> Enter Password </label>
			              <input ref="gpass" name="gethpass" type="password" className="form-control" placeholder="Password"></input>
			            </fieldset>
			           </form>
			           <button onClick={() => this.props.unlockWithPass(this.props.activeAccount, this.refs.gpass)}>Enter</button>
			      </Modal>
			      <span className="icon icon-key"></span>
			      &nbsp;{this.props.unlocked ? 'Lock' : 'Unlock'}
			    </button>
			  </div>
			</footer>
		)
	}
})