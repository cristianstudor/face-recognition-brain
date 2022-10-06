import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import Navigation from './components/Navigation/Navigation.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Logo from './components/Logo/Logo.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';
import './App.css';

const initialState = {
  input:'',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input:'',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box })
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ 
        route:'home',
        isSignedIn: true 
      });
    } else {
      this.setState({route: route});
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onPictureSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ input: this.state.input })
    })
    .then(response => response.json())
    .then(response => {
      if(response) {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ id: this.state.user.id })
        })
        .then(response => response.json())
        .then(entries => {
          if(entries) {
            this.setState(Object.assign(this.state.user, {entries:entries}))
          }
        })
        .catch(console.log);
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch( err => console.log('error', err) )
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  render() {
    const { imageUrl, box, route, isSignedIn } = this.state;
    const { name, entries } = this.state.user;
    return (
      <div className='App'>
        <ParticlesBg color="#000000" type="cobweb" num={200} bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' 
          ? <div>
            <Logo />
            <Rank name={name} entries={entries}/>
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onPictureSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>
          : (
              route === 'signin' 
              ? <Signin 
                  onRouteChange={this.onRouteChange}
                  loadUser={this.loadUser}
                />
              : <Register 
                  onRouteChange={this.onRouteChange} 
                  loadUser={this.loadUser}
                />
            )
        }
      </div>
    )
  }
}

export default App;
