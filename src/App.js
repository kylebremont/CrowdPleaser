import React, { Component } from 'react';
import { authEndpoint, clientId, redirectUri, scopes } from './config';
import hash from './hash';
import './App.css';
import Search from './components/Search';
import Queue from './components/Queue';
import Playback from './components/Playback';
import GuestPlayback from './components/GuestPlayback';
import JoinOrCreate from './components/JoinOrCreate';
import Playlists from './components/Playlists';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import 'react-tabs/style/react-tabs.css';

class App extends Component {
	constructor() {
		super();
		this.state = {
			token: null,
			loggedIn: false,
			songInfo: null,
			party: null,
			isHost: false
		};

		this.queueElement = React.createRef();
		this.playbackElement = React.createRef();

		this.playSong = this.playSong.bind(this);

		this.addToQueue = this.addToQueue.bind(this);
		this.requestSong = this.requestSong.bind(this);

		this.setParty = this.setParty.bind(this);
	}

	componentDidMount() {
		let _token = hash.access_token;

		if (_token) {
			// Set token
			this.setState({
				token: _token,
				loggedIn: true
			});
		}
	}

	setParty(party_id, isHost) {
		this.setState({ party: party_id, isHost });
	}

	addToQueue(songInfo) {
		this.queueElement.current.enqueue(songInfo);
	}

	requestSong() {
		this.queueElement.current.GetQueue(true);
	}

	playSong(song) {
		this.playbackElement.current.setSong(song);
	}

	render() {
		return (
			<div className="App">
				<div className="app-head">crowdpleaser</div>
				{!this.state.loggedIn &&
				!this.state.party && (
					<div>
						<br />
						<br />
						<br />
						<br />
						<br />
						<br />
						<br />
						<a
							id="login"
							href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
								'%20'
							)}&response_type=token&show_dialog=true`}
						>
							Login to Spotify
						</a>
					</div>
				)}
				{this.state.loggedIn &&
				!this.state.party && (
					<div className="Appcontent">
						<JoinOrCreate access_token={this.state.token} setParty={this.setParty} />
					</div>
				)}
				{this.state.loggedIn &&
				this.state.party && (
					<div className="Appcontent">
						party code: <div style={{ fontWeight: 'bold' }}>{this.state.party}</div>
						<Tabs forceRenderTabPanel={true}>
							<TabList style={{ color: 'black' }}>
								<Tab>up next</Tab>
								<Tab>search</Tab>
								<Tab>playlists</Tab>
							</TabList>

							<TabPanel>
								<Queue
									ref={this.queueElement}
									playSong={this.playSong}
									party={this.state.party}
									isHost={this.state.isHost}
								/>
							</TabPanel>
							<TabPanel>
								<Search access_code={this.state.token} addToQueue={this.addToQueue} />
							</TabPanel>
							<TabPanel>
								<Playlists access_token={this.state.token} addToQueue={this.addToQueue} />
							</TabPanel>
						</Tabs>
						{this.state.isHost && (
							<Playback
								ref={this.playbackElement}
								access_code={this.state.token}
								requestSong={this.requestSong}
								party={this.state.party}
							/>
						)}
						{!this.state.isHost && (
							<GuestPlayback
								ref={this.playbackElement}
								requestSong={this.requestSong}
								party={this.state.party}
							/>
						)}
					</div>
				)}
			</div>
		);
	}
}

export default App;
