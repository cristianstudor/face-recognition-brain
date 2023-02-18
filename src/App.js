import React, { Component } from "react";
import ParticlesBg from "particles-bg";
import Navigation from "./components/Navigation/Navigation.js";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.js";
import Logo from "./components/Logo/Logo.js";
import Rank from "./components/Rank/Rank.js";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition.js";
import Signin from "./components/Signin/Signin.js";
import Register from "./components/Register/Register.js";
import "./App.css";

const initialState = {
  input: "",
  imageUrl: "",
  boxes: [],
  route: "home",
  isSignedIn: false,
  isLoading: false,
  user: {
    id: "",
    name: "Guest",
    email: "",
    entries: 0,
    joined: ""
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  calculateFaceLocations = (data) => {
    const clarifaiFaces = data.outputs[0].data.regions;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);

    return clarifaiFaces.map((region) => {
      const bounding_box = region.region_info.bounding_box;
      return {
        leftCol: bounding_box.left_col * width,
        topRow: bounding_box.top_row * height,
        rightCol: width - bounding_box.right_col * width,
        bottomRow: height - bounding_box.bottom_row * height
      };
    });
  };

  displayFaceBoxes = (boxes) => {
    this.setState({ boxes: boxes });
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
      this.setState({ route: "signin" });
    } else {
      this.setState({ route: route });
    }
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onPictureSubmit = () => {
    this.setState({ isLoading: true, imageUrl: this.state.input });
    fetch("https://smart-brain-api-pzgd.onrender.com/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: this.state.input })
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.outputs) {
          if (this.state.isSignedIn) {
            fetch("https://smart-brain-api-pzgd.onrender.com/image", {
              method: "put",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: this.state.user.id })
            })
              .then((response) => response.json())
              .then((entries) => {
                if (entries) {
                  this.setState(
                    Object.assign(this.state.user, { entries: entries })
                  );
                }
              })
              .catch(console.log);
          } else {
            this.setState(
              Object.assign(this.state.user, {
                entries: this.state.user.entries + 1
              })
            );
          }
          this.displayFaceBoxes(this.calculateFaceLocations(response));
        }
      })
      .catch((err) => console.log("error", err))
      .finally(() => this.setState({ isLoading: false }));
  };

  loadUser = (data) => {
    this.setState({
      input: "",
      imageUrl: "",
      boxes: [],
      isSignedIn: true,
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  };

  render() {
    const { imageUrl, boxes, route, isSignedIn, isLoading } = this.state;
    const { name, entries } = this.state.user;
    return (
      <div className="App">
        <ParticlesBg color="#000000" type="cobweb" num={200} bg={true} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank name={name} entries={entries} />
            <ImageLinkForm
              isLoading={isLoading}
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onPictureSubmit}
            />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        ) : (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        )}
      </div>
    );
  }
}

export default App;
