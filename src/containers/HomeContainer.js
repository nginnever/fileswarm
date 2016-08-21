import {connect} from 'react-redux'
import {Home} from '../components/Home'

function mapStateToProps(state) {
  return state.mainReducer.toJSON()
}

export const HomeContainer = connect(mapStateToProps)(Home)