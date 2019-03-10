import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class PriceRange extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            price: 0
        }

        this.handleChange = this.handleChange.bind(this)
        this.sendPrice = this.sendPrice.bind(this)
    }

    handleChange(e)
    {
        const value = parseInt(e.target.value)

        if (!isNaN(value)) {
            this.setState({
                price: value
            })
        }
    }

    sendPrice()
    {
        this.props.onChange(this.state.price)
    }

    render()
    {
        return(
            <div className="filter-price">
                <input placeholder="Prix maximum" type="number" onChange={ this.handleChange } />
                <button onClick={ this.sendPrice }>Mettre à jour</button>
            </div>
        )
    }
}

PriceRange.propTypes = {
    onChange: PropTypes.func.isRequired,
}

PriceRange.defaultProps = {
    onChange: () => { console.error('Function onChange() not defined in the props.')}
}