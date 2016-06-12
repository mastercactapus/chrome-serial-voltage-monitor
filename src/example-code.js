import React from 'react'

import sketch from 'raw!./sketch.ino'
import FileFileDownload from 'material-ui/svg-icons/file/file-download'
import IconButton from 'material-ui/IconButton'

const codeStyle = {
  display: "block",
  padding: 4,
  backgroundColor:"lightgray"
}

function downloadSketch(e) {
  e.preventDefault()

}

export default function ExampleCode () {
  return <div style={{padding: 16}}>
    <p>This sketch may be uploaded to an Arduino to feed voltage data to this app.</p>
    <pre>
      <code
        className="allow-select"
        style={codeStyle}>

        {sketch}
      </code>
    </pre>
    <a
      href={URL.createObjectURL(new Blob([sketch], {type: "text/plain"}))}
      download="serial_voltage_monitor.ino">

      <IconButton
        onTouchTap={downloadSketch}
        tooltip="Download sketch"
        tooltipPosition="top-right">

        <FileFileDownload />
      </IconButton>
    </a>
  </div>
}
