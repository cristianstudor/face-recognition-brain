import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Logo from './components/Logo/Logo.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'a9e8af591f494958b178929c6b69eb68'
});

class App extends Component {
  constructor() {
    super();
    this.state={
      input:'',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
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
      this.setState({ 
        route:'signin',
        isSignedIn: false
      })
    } else if (route === 'home') {
      this.setState({ 
        route:'home',
        isSignedIn: true 
      })
    } else {
      this.setState({ route:route })
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then( response => this.displayFaceBox(this.calculateFaceLocation(response)) )
    .catch( err => console.log('error', err) )
  }

  render() {
    const { imageUrl, box, route, isSignedIn } = this.state;
    return (
      <div className='App'>
        <ParticlesBg color="#000000" type="cobweb" num={200} bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' 
          ? <div>
            <Logo />
            <Rank />
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>
          : (
              route === 'signin' 
              ? <Signin onRouteChange={this.onRouteChange}/>
              : <Register onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    )
  }
}

export default App;
