import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PriceRange from './PriceRange'

export default class City extends Component
{
    constructor(props)
    {
        super(props)
        
        this.state = {}
    }
    
    render()
    {
        return(
            <div className="filter-city">
                <select name="city" onChange={ this.props.onChange }>
                    <option value="montreal">Montréal</option>
                </select>
            </div>
        )
    }
}

City.propTypes = {
    onChange: PropTypes.func.isRequired,
}

City.defaultProps = {
    onChange: () => { console.error('Function onChange() not defined in the props.')}
}