import React from 'react';
import Navbar from '../components/navbar';
import RunInfo from '../components/runInfo';
import { Container, Carousel } from 'react-bootstrap';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import DropdownCustom from '../components/dropdown';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null
    };
  }

  componentDidMount() {
    const details = {
      method: 'GET',
      headers: {
        'X-Access-Token': this.props.login.token
      }
    };
    fetch('/api/posts', details).then(result => result.json()).then(posts => {
      this.setState({
        posts
      });
    }).catch(err => console.error(err));
  }

  render() {
    if (!this.state.posts) return;
    const username = this.props.login.user.username;

    let imgSrc, postData;
    const posts = this.state.posts.map((post, index) => {
      postData = post;
      let carouselItems = post.images.map(image => {
        if (image.on) {
          imgSrc = image.url;
          return (
            <Carousel.Item key={image.url} id={image.url} className="text-light position-relative">
              <img src={image.url} />
            </Carousel.Item>
          );
        } else {
          return null;
        }
      });
      carouselItems = carouselItems.filter(x => x !== null);

      const ellipsis = (username === postData.username)
        ? <FontAwesomeIcon icon={faEllipsis} size="xl" />
        : null;

      const carousel = (carouselItems.length !== 1)
        ? <Carousel interval={null}>{carouselItems}</Carousel>
        : <div className='single-image-post'><img src={imgSrc} /></div>;

      const now = new Date();
      const then = new Date(postData.postedAt);
      const result = formatDistanceStrict(then, now, { includeSeconds: true, addSuffix: true });

      const options = [
        { href: '#edit', text: 'Edit' }
      ];

      return (
        <Container className="outer" key={postData.postId}>
          <div className='d-flex'>
            <p className='desktop-username m-2 mb-1 ps-3'>{postData.username}</p>
            <div className='ms-auto dropdown-ellipsis align-self-center me-3'>
              <DropdownCustom ellipsis={ellipsis} options={options} />
            </div>
          </div>
          {carousel}
          <RunInfo key={postData.postId} postData={postData} />
          <Container className='mt-1 mb-3'>
            <div className='d-flex'>
              <p className='small mb-0'>{postData.username}</p>
              <p className='small ps-2 mb-0'>{postData.caption}</p>
            </div>
            <div>
              <p className='small mb-0'>{result}</p>
            </div>
          </Container>
        </Container>
      );
    });

    return (
      <div className="home-page" >
        <Navbar />
        {posts}
      </div>
    );
  }
}
