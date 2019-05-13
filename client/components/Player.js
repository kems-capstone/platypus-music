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

// <div id="audioplayer" style="border: 1px solid black">
//   <button id="pButton" class="play" onclick="playAudio()"></button>
//     <div id="timeline">
//     <div id="playhead"></div>
//   </div>
//   <div id="volume_control">
//     <label id="rngVolume_label" for="rngVolume">Volume:</label>
//     <input type="range" onchange="setVolume(this.value)" id="rngVolume" min="0" max="1" step="0.01" value="1">
//   </div>
// </div>
