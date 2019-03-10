import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PriceRange from './PriceRange'

export default class Filters extends Component
{
    constructor(props)
    {
        super(props)
        
        this.state = {}
    }
    
    render()
    {
        return(
            <div className="filters-container">
                <PriceRange onChange={ this.props.onChangePrice }/>
            </div>
        )
    }
}

Filters.propTypes = {
    onChangePrice: PropTypes.func.isRequired,
}

Filters.defaultProps = {
    onChangePrice: () => { console.error('Function onChangePrice() not defined in the props.')}
}