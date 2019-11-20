import React from 'react'
import { inject, observer } from 'mobx-react'
import { Redirect } from 'react-router-dom'
import ItemCreator from '../../../components/lists/ItemCreator'

import UserCreatorForm from './UserCreatorForm'

class UserCreator extends React.Component {

  state = {
    isLoading: true,
    redirectTo: null
  }

  componentDidMount() {
    let { props } = this
    this.form = new UserCreatorForm(props.Settings, props.AdminAppUserStore, this.handleSuccess)
    // this.props.NarrativeTemplateStore.Load()
    //   .then(() => {
    //     this.form.fieldInfo.extra.NarrativeTemplateID.options = this.props.NarrativeTemplateStore.Items
    this.setState({ isLoading: false })
    // })
  }

  handleSuccess = (newItem) => {
    this.setState({
      redirectTo: "/settings/users/" + newItem.AppUserID
    })
  }

  render() {
    if (this.state.isLoading)
      return (null)

    if (this.state.redirectTo)
      return (<Redirect to={this.state.redirectTo} />)

    return (
      <ItemCreator typeTitle="User"
        iconName="lightbulb"
        form={this.form}
      />
    )

  }
}

export default inject("Settings", "AdminAppUserStore")(observer(UserCreator))