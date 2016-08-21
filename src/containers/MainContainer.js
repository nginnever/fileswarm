import {connect} from 'react-redux'
import {Main} from '../components/Main'

const mapStateToProps = (state) => {
  return state.mainReducer.toJSON()
}


export const MainContainer = connect(mapStateToProps)(Main)