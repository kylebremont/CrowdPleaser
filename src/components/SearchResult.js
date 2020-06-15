import React, { Component } from 'react';
import './SearchResult.css';

export default class SearchResult extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: props.data.name,
			artist: props.data.artist,
			uri: props.data.uri,
			image: props.data.image,
			duration: props.data.duration,
			votes: 0
		};
	}

	render() {
		return (
			<div
				style={{ cursor: 'pointer' }}
				onClick={() => {
					this.props.getSongUri(this.state);
				}}
			>
				<div id="row">
					<div id="art-column">
						<img src={this.state.image} alt="album cover" className="imgz" />
					</div>
					<div id="info-column">
						<div id="song-title">{this.state.name}</div>
						<br />
						<div id="song-artist">{this.state.artist}</div>
					</div>
				</div>
			</div>
		);
	}
}
