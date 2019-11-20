import React from 'react'
import { inject, observer } from 'mobx-react'
import { FormGroup, ControlLabel } from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import Icon from 'react-fontawesome'
import Api from '../../../services/Api'

const uploadClassName = "evidence-field__upload"
const uploadClassNameDragOver = "evidence-field__upload--dragover"

class ImagePreference extends React.Component {

  state = {
    isUploading: false,
    upload: null,
    uploadClassName: uploadClassName
  }

  componentDidMount() {
    let { props } = this    
    let value = props.Settings[props.type][props.settingKey]
    if (value) {
      var parts = value.split("/")
      this.setState({ upload: { FileName: parts[0], Name: parts[1] } })
    }
  }

  handleUploadFile = (files) => {
    let file = files[0]
    this.setState({ isUploading: true })
    let { props } = this
    Api.Images.Upload(file)
      .then((response) => {
        props.Settings[`Set${props.type.charAt(0).toUpperCase() + props.type.slice(1)}Setting`](props.settingKey, `${response.data.FileName}/${file.name}`)
        this.setState({ isUploading: false, upload: { ...response.data, Name: file.name } })
      })
  }
  handleRemoveUpload = () => {
    let { props } = this
    props.Settings[`Set${props.type.charAt(0).toUpperCase() + props.type.slice(1)}Setting`](props.settingKey, null)
    this.setState({ upload: null })
  }

  render() {
    let { props } = this
    let value = props.Settings[props.type][props.settingKey]

    let { isUploading, upload, uploadClassName } = this.state

    return (
      <FormGroup className="evidence-field">
        {props.title && <ControlLabel>{props.title}</ControlLabel>}
        {!isUploading && !upload &&
          <Dropzone onDrop={this.handleUploadFile} multiple={false}
            onDragEnter={() => this.setState({ uploadClassName: `${uploadClassName} ${uploadClassNameDragOver}` })}
            onDragLeave={() => this.setState({ uploadClassName: uploadClassName })}>
            {({ getRootProps, getInputProps }) => (
              <section {...getRootProps({ className: uploadClassName })}>
                <div>
                  <input {...getInputProps()} />
                  <p><Icon name="upload" size="2x" /></p>
                  <p><strong>Drag &amp; drop image file here, or click to select file</strong></p>
                  {props.instructions && <p>{props.instructions}</p>}
                </div>
              </section>
            )}
          </Dropzone>
        }
      {isUploading &&
        <div className="busy">
          <div className="busy-wrap">
            <div className="busy-icon"></div>
          </div>
          <div className="busy-text">Uploading please wait...</div>
        </div>
      }       
      {!isUploading && upload &&
        <div className="evidence-field__uploaded">
          <Icon name="upload" />
          <span>
            {upload.Name}
          </span>
          <a className="clickable" onClick={this.handleRemoveUpload}>Remove</a>
        </div>
      }      

      </FormGroup>
    )
  }
}

export default inject("Settings")(observer(ImagePreference))