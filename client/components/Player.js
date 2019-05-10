import React, {Component} from 'react';

export default class Player extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <audio
          autoPlay={true}
          onEnded={this.props.nextTrack}
          src={this.props.selectedSong}
          controls
          id="audioPlayer-host"
        />
      </div>
    );
  }
}
