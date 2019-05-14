import songs from '../../songs';
import _ from 'lodash';
import React, {Component} from 'react';
import {Search, Grid, Header, Segment, Form} from 'semantic-ui-react';
import {addSongThunk} from '../store';
import {connect} from 'react-redux';

const initialState = {isLoading: false, results: [], value: ''};

const searchSongs = songs.map(song => {
  return {
    title: song.name,
    description: song.genre,
    image: song.artworkUrl,
    artist: song.artist,
    audio: song.audioUrl
  };
});

const source = searchSongs;

class UiSearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event, {result}) {
    this.props.handleSubmitWithProps(event, result, this.props);
  }

  handleSearchChange = (e, {value}) => {
    this.setState({isLoading: true, value});

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState);

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = result => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch)
      });
    }, 300);
  };

  render() {
    const {isLoading, value, results} = this.state;

    return (
      <Grid id="ui-search-form">
        <Grid.Column width={6}>
          {/* <Form onSubmit={this.props.handleSubmit}> */}
          <Search
            loading={isLoading}
            onResultSelect={this.onSubmit}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true
            })}
            results={results}
            value={value}
          />
          {/* <input type="submit" value="Submit" />
          </Form> */}
        </Grid.Column>
      </Grid>
    );
  }
}
const mapDispatch = dispatch => {
  return {
    addSong: (song, room) => dispatch(addSongThunk(song, room))
  };
};

export default connect(null, mapDispatch)(UiSearchForm);
