import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {connect} from 'react-redux'

export const Main = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return (
      <div className="window">
<header className="toolbar toolbar-header" style={{flexDirection:'row' }}>
    <img src={'logo.svg'} style={{height: 25, marginTop: 5, marginLeft: 3, marginRight: 0}} />
  <div className="toolbar-actions" style={{marginLeft: 25, marginTop: -31}}>

    <div className="btn-group">
      <button className="btn btn-default">
        <span className="icon icon-home"></span>
      </button>
      <button className="btn btn-default">
        <span className="icon icon-upload"></span>
      </button>
      <button className="btn btn-default active">
        <span className="icon icon-folder"></span>
      </button>
      <button className="btn btn-default">
        <span className="icon icon-book"></span>
      </button>
    </div>

    <button className="btn btn-default">
      <span className="icon icon-network icon-text" style={{color: '#20BE6F'}}></span>
      14949495 Files
    </button>
    <button className="btn btn-default btn-dropdown pull-right">
      <span className="icon icon-user"></span>
    </button>
    <button className="btn btn-default pull-right">
      
      Balance: Ξ420.2992944
    </button>
  </div>
</header>

        <div className="window-content">
          <div className="pane-group">
            <div className="pane-sm sidebar">

<nav className="nav-group">
  <h5 className="nav-group-title">Dashboard</h5>
  <a className="nav-group-item active">
    <span className="icon icon-home"></span>
    Fileswarm
  </a>
  <span className="nav-group-item">
    <span className="icon icon-upload"></span>
    Seeding
  </span>
  <span className="nav-group-item">
    <span className="icon icon-folder"></span>
    Files
  </span>
  <span className="nav-group-item">
    <span className="icon icon-book"></span>
    Account
  </span>
</nav>

            </div>
            <div className="pane">
               <h1>FILESWARM: Decentralized File Storage Platform</h1>
            </div>
          </div>
        </div>

<footer className="toolbar toolbar-footer">
  <div className="toolbar-actions">
    <button className="btn btn-default">
      <span className="icon icon-stop"></span>
      &nbsp; Stop Seeding
    </button>
    <button className="btn btn-warning pull-right">
      <span className="icon icon-key"></span>
      &nbsp; Unlock
    </button>
  </div>
</footer>

      </div>
    )
  }
})

function mapStateToProps(state) {
  console.log(state.toJSON())
  return state.toJSON()
}

export const MainContainer = connect(mapStateToProps)(Main)