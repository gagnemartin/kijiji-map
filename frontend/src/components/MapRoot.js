import React, { PureComponent } from 'react'
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react'
import he from 'he'
import axios from 'axios'
import Filters from './Filters'

export class MapRoot extends PureComponent
{
	constructor(props)
	{
		super(props)

		this.state = {
			initialCenter: {
				lat: 45.5017,
				lng: -73.5673
			},
			loading: true,
			ads: [],
			activeMarker: this.emptyAd,
			isVisibleInfoWindow: false,
			filters: {}
		}

		this.onMarkerClick = this.onMarkerClick.bind(this)
		this.setCurrentLocation = this.setCurrentLocation.bind(this)
		this.getCurrentLocation = this.getCurrentLocation.bind(this)
		this.fetchAds = this.fetchAds.bind(this)
		this.onInfoWindowClose = this.onInfoWindowClose.bind(this)
		this.onChangePrice = this.onChangePrice.bind(this)
	}

	componentDidMount()
	{
		this.setCurrentLocation()
		this.fetchAds()
	}

	emptyAd()
	{
		return {
			name: '',
			price: null,
			thumbnail: null,
			lat: 0,
			lng: 0,
			description: null,
		}
	}

	onInfoWindowClose()
	{
		if (this.state.isVisibleInfoWindow) {
			this.setState({
				activeMarker: this.emptyAd(),
				isVisibleInfoWindow: false
			})
		}
	}

	onMarkerClick(marker)
	{
		this.setState({
			activeMarker: marker,
			isVisibleInfoWindow: true
		})
	}

	setCurrentLocation()
	{
		this.getCurrentLocation()
			.then(response =>{
				const coords = {
					lat: response.coords.latitude,
					lng: response.coords.longitude
				}

				this.setState({
					initialCenter: coords,
					loading: false
				})
			})
			.catch(thrown => {
				console.error('Did not authorized Geolocation')

				this.setState({
					loading: false
				})
			})
	}

	async getCurrentLocation()
	{
		let location = this.state.initialCenter

		if (navigator.geolocation) {
			return new Promise((res, rej) => {
				navigator.geolocation.getCurrentPosition(res, rej)
			})
		} else {
			// Browser doesn't support Geolocation
			console.error("Your browser doesn't support Geolocation")
		}

		return location
	}

	fetchAds(url = '/ads/list')
	{
		const API_BASE_URL = 'http://localhost:8000/api/v1'

		axios.get(API_BASE_URL + url)
			.then(response => {
				this.setState({
					ads: response.data
				})
			})
			.catch(thrown => {
				console.error(thrown)
			})
	}

	onChangePrice(price)
	{
		if (price <= 0) {
			this.fetchAds()
		} else {
			const url = '/ads/list?price=' + price

			this.fetchAds(url)
		}

	}

	render()
	{
		const activeMarker = this.state.activeMarker

		return (
			<React.Fragment>
				<Map
					google={ this.props.google }
					zoom={ 14 }
					center={ this.state.initialCenter }
					initialCenter={ this.state.initialCenter }
					onClick={ this.onInfoWindowClose }
				>
					{ this.state.ads.map((ad, index) => (
						<Marker
							key={ ad.lat + '-' + ad.lng + '-' + index}
							label={{
								text: ad.price === null ? 'Sur demande' : parseInt(ad.price) + '$',
								fontWeight: 'bold',
							}}
							name={ he.decode(ad.name) }
							position={{
								lat: parseFloat(ad.lat),
								lng: parseFloat(ad.lng)
							}}
							onClick={ this.onMarkerClick.bind(this, ad) }
						/>
					))}

					<InfoWindow
						visible={ this.state.isVisibleInfoWindow }
						onClose={ this.onInfoWindowClose }
						position={{
							lat: parseFloat(activeMarker.lat),
							lng: parseFloat(activeMarker.lng)
						}}
					>
						<div style={{ maxWidth: '200px'}}>
							{'thumbnail' in activeMarker && activeMarker.thumbnail !== null &&
							<a rel="noopener noreferrer" target="_blank" href={ activeMarker.url }>
								<img style={{ maxWidth: '100%', height: 'auto' }} src={ activeMarker.thumbnail }
									 alt={ he.decode(activeMarker.name) }/>
							</a>
							}
							<h3>{ he.decode(activeMarker.name) }</h3>
							<p>Prix: { activeMarker.price === null ? 'Sur demande' : parseInt(activeMarker.price) + '$' }</p>
							<a rel="noopener noreferrer" target="_blank" href={ activeMarker.url }>Voir l'annonce sur Kijiji</a>
						</div>
					</InfoWindow>
				</Map>
				<Filters
					onChangePrice={ this.onChangePrice }
				/>
			</React.Fragment>
		)
	}
}

// TODO Change Google API key restrictions when done
export default GoogleApiWrapper({
	apiKey: 'AIzaSyC3jWL_efDQ1w8aQZmxO_JlYfF4Dp68mM8',
	language: 'fr_CA'
})(MapRoot)
