import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Story extends Component {
  static propTypes = {
    kind: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }

  render() {
    const {
      kind,
      name,
      ...rest
    } = this.props

    return <div {...rest}>{kind} {name}</div>
  }
}
