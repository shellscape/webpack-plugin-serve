import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import Story from './story'

export default class Stories extends Component {
  static propTypes = {
    kind: PropTypes.string.isRequired
  }

  render() {
    const {
      kind,
      storyProps = {},
      ...rest
    } = this.props

    const names = [ 'foo', 'bar' ]

    return (
      <div {...rest}>
        {names.map(name => (
          <Fragment key={name}>
            <h2>{name}</h2>

            <Story kind={kind} name={name} {...storyProps} />
          </Fragment>
        ))}
      </div>
    )
  }
}
