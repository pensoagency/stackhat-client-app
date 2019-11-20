import React from 'react'
import { observer } from 'mobx-react'
import { ControlLabel, FormGroup, FormControl, ButtonGroup, Button } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import Dropzone from 'react-dropzone'
import FieldRequiredIndicator from './FieldRequiredIndicator'
import Api from '../../services/Api';

const uploadClassName = "image__upload"
const uploadClassNameDragOver = "image__upload--dragover"

class ImageUpload extends React.Component {

  state = {
    type: "text",
    placeholder: "Enter link... e.g. https://www.example.com/page",
    isUploading: false,
    upload: null,
    uploadClassName: uploadClassName
  }

  componentDidMount() {
    let { field } = this.props
    if (field.value.startsWith("evidence://")) {
      let parts = field.value.substring("evidence://".length).split("/")
      this.setState({ type: "file", upload: { FileName: parts[0], Name: parts[1] } })
    }
  }

  handleUploadFile = (files) => {
    let { field } = this.props
    let file = files[0]
    this.setState({ isUploading: true })
    Api.Evidences.Upload(file)
      .then((response) => {
        field.set(`evidence://${response.data.FileName}/${file.name}`)
        this.setState({ isUploading: false, upload: { ...response.data, Name: file.name } })
      })
  }
  handleRemoveUpload = () => {
    this.setState({ upload: null })
  }

  render() {
    let { field } = this.props
    let { type, placeholder, isUploading, upload, uploadClassName } = this.state

    return <FormGroup className="evidence-field">
      {field.label && <ControlLabel>{field.label} <FieldRequiredIndicator field={field} /></ControlLabel>}

      {type === "text" && <div className="evidence-field__input"><FormControl {...field.bind()} {...field.extra} placeholder={placeholder} type={type} /></div>}

      {type === "file" && !isUploading && !upload &&
        <Dropzone onDrop={this.handleUploadFile} multiple={false}
          onDragEnter={() => this.setState({ uploadClassName: `${uploadClassName} ${uploadClassNameDragOver}` })}
          onDragLeave={() => this.setState({ uploadClassName: uploadClassName })}>
          {({ getRootProps, getInputProps }) => (
            <section {...getRootProps({ className: uploadClassName })}>
              <div>
                <input {...getInputProps()} />
                <p><Icon name="upload" size="2x" /></p>
                <p><strong>Drag &amp; drop file here, or click to select file</strong></p>
              </div>
            </section>
          )}
        </Dropzone>
      }
      {type === "file" && isUploading &&
        <div className="busy">
          <div className="busy-wrap">
            <div className="busy-icon"></div>
          </div>
          <div className="busy-text">Uploading please wait...</div>
        </div>
      }
      {type === "file" && !isUploading && upload &&
        <div className="evidence-field__uploaded">
          <Icon name="upload" />
          <span>
            {upload.Name}
          </span>
          <a className="clickable" onClick={this.handleRemoveUpload}>Remove</a>
        </div>
      }

      <span className="validation-error">{field.error}</span>
    </FormGroup>
  }
}

export default observer(ImageUpload)