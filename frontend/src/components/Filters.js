import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PriceRange from './PriceRange'
import City from './City'
import Rooms from './Rooms'

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
                <City onChange={ this.props.onChangeCity }/>
                <Rooms onChange={ this.props.onChangeRooms }/>
            </div>
        )
    }
}

Filters.propTypes = {
    onChangePrice: PropTypes.func.isRequired,
    onChangeCity: PropTypes.func.isRequired,
    onChangeRooms: PropTypes.func.isRequired,
}

Filters.defaultProps = {
    onChangePrice: () => { console.error('Function onChangePrice() not defined in the props.') },
    onChangeCity: () => { console.error('Function onChangeCity() not defined in the props.') },
    onChangeRooms: () => { console.error('Function onChangeRooms() not defined in the props.') }
}