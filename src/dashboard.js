import React, { Component } from 'react'
import { connect } from 'react-redux'
import MenuItem from 'material-ui/MenuItem'
import Snackbar from 'material-ui/Snackbar'
import IconButton from 'material-ui/IconButton'
import DeviceUSB from 'material-ui/svg-icons/device/usb'
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart'
import ActionSettings from 'material-ui/svg-icons/action/settings'
import IconMenu from 'material-ui/IconMenu'
import Subheader from 'material-ui/Subheader'
import Popover from 'material-ui/Popover'

import ChartOptions from './chart-options'
import DeviceOptions from './device-options'
import Monitor from './monitor'

import { setDevice, setOptions, ackError } from './actions'



export class Dashboard extends Component {
  constructor() {
    super()
    this.state = {
      chartOptionsAnchor: null,
      chartOptionsOpen: false,
      deviceOptionsAnchor: null,
      deviceOptionsOpen: false
    }
  }
  openChartOptions(e) {
    e.preventDefault()

    this.setState({
      chartOptionsOpen: true,
      deviceOptionsOpen: false,
      chartOptionsAnchor: e.currentTarget
    })
  }
  openDeviceOptions(e) {
    e.preventDefault()

    this.setState({
      chartOptionsOpen: false,
      deviceOptionsOpen: true,
      deviceOptionsAnchor: e.currentTarget
    })
  }
  setDevice (path) {
    this.props.setDevice(this.props.devices.find(d => d.path === path))
  }
  render () {
    var devices = this.props.devices.map(dev => {
      return <MenuItem key={dev.path} primaryText={dev.displayName.replace(/_/g, ' ')} value={dev.path} />
    })
    if (devices.length === 0) {
      devices.push(<MenuItem disabled={true} key={null} primaryText="No devices found" />)
    }

    var devClass = ""
    if (!this.props.path) devClass = "pulse"

    var err = this.props.error ? 'ERROR: ' + this.props.error.message : ''
    return <div>
             <IconMenu
                onChange={(e,val)=>this.setDevice(val)}
                iconButtonElement={<IconButton tooltipPosition="bottom-right" tooltip="Select device"><DeviceUSB className={devClass} /></IconButton>}
                value={this.props.path}>
                  {devices}
             </IconMenu>

             <IconButton
                onTouchTap={e=>this.openDeviceOptions(e)}
                tooltipPosition="bottom-right"
                tooltip="Device settings">
              <ActionSettings />
             </IconButton>

             <Popover
                open={this.state.deviceOptionsOpen}
                anchorEl={this.state.deviceOptionsAnchor}
                onRequestClose={()=>this.setState({deviceOptionsOpen: false})}>

                <DeviceOptions />
             </Popover>

             <IconButton
              onTouchTap={e=>this.openChartOptions(e)}
              tooltipPosition="bottom-right"
              tooltip="Chart options">
               <EditorInsertChart />
             </IconButton>
             <Popover
                open={this.state.chartOptionsOpen}
                anchorEl={this.state.chartOptionsAnchor}
                onRequestClose={()=>this.setState({chartOptionsOpen: false})}>

                <ChartOptions />
              </Popover>
             <Subheader style={{display: "inline-block", verticalAlign: "top", width:"auto"}}>{this.props.status}</Subheader>
             <div>

               <Snackbar
                 action="OK"
                 autoHideDuration={5000}
                 message={err}
                 onActionTouchTap={()=>this.props.ackError(this.props.error && this.props.error.id)}
                 onRequestClose={() => this.props.ackError(this.props.error && this.props.error.id)}
                 open={!!this.props.error} />
             </div>
             <div>
              <Monitor />
             </div>
           </div>
  }
}

const mapStateToProps = (state) => {

  var status;
  if (state.conn) status = "Connected to: " + state.conn.name
  else if (state.selected.device) "Connecting to: " + state.selected.device.displayName.replace(/_/g, ' ')
  else status = "Not Connected"

  return {
    error: state.errors.find(e => !e.ack),
    devices: state.devices,
    path: state.selected.device && state.selected.device.path,
    status
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ackError: id => dispatch(ackError(id)),
    setDevice: device => dispatch(setDevice(device)),
    setBitrate: rate => dispatch(setOptions({bitrate: rate}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
