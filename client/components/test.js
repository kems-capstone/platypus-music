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

export class SearchExampleStandard extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    console.log(this.props);
  }

  handleResultSelect = (e, {result}) => this.setState({value: result.title});

  // handleResultSelect(event) {
  //   try {
  //     event.preventDefault();

  //     this.props.addSong(
  //       this.props.form.search.values.trackSearch,
  //       this.props.room.room.roomInfo.rooms[0].id
  //     );
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // }

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
      <Grid>
        <Grid.Column width={6}>
          {/* <Form onSubmit={this.props.handleSubmit}> */}
          <Search
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true
            })}
            results={results}
            value={value}
            {...this.props}
          />
          {/* <input type="submit" value="Submit" />
          </Form> */}
        </Grid.Column>
        <Grid.Column width={10}>
          <Segment>
            <Header>State</Header>
            <pre style={{overflowX: 'auto'}}>
              {JSON.stringify(this.state, null, 2)}
            </pre>
            <Header>Options</Header>
            <pre style={{overflowX: 'auto'}}>
              {JSON.stringify(source, null, 2)}
            </pre>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addSong: (song, room) => dispatch(addSongThunk(song, room))
  };
};

const mapStateToProps = state => {
  return {
    room: state.room
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  SearchExampleStandard
);
