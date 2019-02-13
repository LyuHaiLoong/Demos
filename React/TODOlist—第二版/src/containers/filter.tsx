import { connect } from 'react-redux'
import Link from "../components/link"
import { setFilter } from "../actions/index"
import { ContainersType } from "../types/index"

const mapStateToProps: ContainersType.MapStateToProps_Filter = (state,ownProps) => ({
  active: state.filter === ownProps.filter
})
const mapDispatchToProps: ContainersType.MapDispatchToProps_Filter = (dispatch,ownProps) => ({
  showFilter: () => dispatch(setFilter(ownProps.filter))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Link)