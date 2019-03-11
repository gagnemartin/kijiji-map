import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PriceRange from './PriceRange'

export default class Rooms extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {}
    }

    render()
    {
        return(
            <div className="filter-rooms">
                <select name="rooms" onChange={ this.props.onChange }>
                    <option value="null">Peu importe</option>
                    <option value="1.5">1 1/2</option>
                    <option value="2.5">2 1/2</option>
                    <option value="3.5">3 1/2</option>
                    <option value="4.5">4 1/2</option>
                    <option value="5.5">5 1/2</option>
                    <option value="6.5">6 1/2+</option>
                </select>
            </div>
        )
    }
}

Rooms.propTypes = {
    onChange: PropTypes.func.isRequired,
}

Rooms.defaultProps = {
    onChange: () => { console.error('Function onChange() not defined in the props.')}
}