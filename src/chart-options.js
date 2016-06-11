import React,{Component} from 'react'

import {connect} from 'react-redux'

import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';

import Checkbox from 'material-ui/Checkbox';
import Slider from 'material-ui/Slider';
import TextField from 'material-ui/TextField';

import {configChart, configPin} from './actions'

function PinConfig (props) {
  var text = `Label for Analog Pin #${props.pin}`
  return <div>
    <Checkbox
      style={{display: "inline-block", width: "auto"}}
      checked={props.enabled}
      onCheck={(e,val)=>props.configPin({enabled: val})} />
    <TextField
      style={{display: "inline-block"}}
      floatingLabelText={text}
      value={props.label}
      disabled={!props.enabled}
      onChange={(e,val)=>props.configPin({label: val})} />
    <input
      type="color"
      value={props.color}
      disabled={!props.enabled}
      onChange={(e,val)=>props.configPin({color: val})} />
  </div>
}

export class ChartOptions extends Component {
  render() {
    var pins = Object.keys(this.props.pins).map(pin=> <PinConfig
                                                               key={pin}
                                                               configPin={(cfg)=>this.props.configPin(pin, cfg)}
                                                               pin={pin}
                                                               {...this.props.pins[pin]} />)
    return <div style={{padding:16}}>
      <Toggle
        label="Legend"
        toggled={this.props.showLegend}
        onToggle={(e,val)=>this.props.configChart({showLegend: val})} />
        <Divider />
      {pins}
    </div>
  }
}

const mapStateToProps = (state) => {
  var pins = {}
  for (let pin in state.pins) {
    if (+pin < state.chart.pinCount) pins[pin] = state.pins[pin]
  }

  return {
    pins,
    pinCount: state.chart.pinCount,
    showLegend: state.chart.showLegend
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    configPin: (pin, cfg) => dispatch(configPin(pin, cfg)),
    configChart: cfg => dispatch(configChart(cfg)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChartOptions)
