import React from 'react';
import Navbar from '../components/navbar';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postData: null
    };
  }

  componentDidMount() {
    fetch('/api/posts').then(result => result.json()).then(postData => {
      this.setState({
        postData
      });
    }).catch(err => console.error(err));
  }

  render() {
    if (!this.state.postData) return;

    return (
      <Navbar />
    );
  }
}
