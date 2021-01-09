import React, { Component } from 'react';
import Navigation from './components/navigation/Navigation'
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import './App.css';

//Clarifai API import
import Clarifai from 'clarifai';

//initializing with the API key.
const app = new Clarifai.App({
 apiKey: 'd16583df0b654ddabfbf8dab4591c19d'
});

const particlesOptions = {
  particles: {
    number:{
        value: 5,
        density:{
          enable:true,
          value_area: 20
      }
    }
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box:{},
      route: 'signIn',
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

  loadUser = (data) => {
    this.setState({user:{
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }
  /*componentDidMount() {
    fetch('http://localhost:3000')
      .then(response => response.json())
      .then(console.log)
  }*/
  calculateFaceLocation = (data) => { 
    const clarifaiFaceBox = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFaceBox.left_col * width,
      topRow: clarifaiFaceBox.top_row * height,
      rightCol: width - (clarifaiFaceBox.right_col * width),
      bottomRow : height - (clarifaiFaceBox.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL,this.state.input)
      .then(response => {
        if(response){
          fetch('http://localhost:3000/image', {
              method: 'put',
              headers: {'Content-Type' : 'application/json'},
              body: JSON.stringify({
              id:this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user,{entries:count}))
          })
      }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
        .catch(err => console.log(err));
    }
    /*app.models.initModel({id: Clarifai.COLOR_MODEL, version: "aa7f35c01e0642fda5cf400f543e7c40"})
      .then(generalModel => {
        return generalModel.predict(this.state.input);
      })
      .then(response => {
        var concepts = response['outputs'][0]['data']['concepts']
        console.log(concepts);
    });
    }*/
  
onRouteChange = (route) =>{
  if(route === 'signout'){
    this.setState({isSignedIn : false})
  } else if(route === 'home'){
    this.setState({isSignedIn : true})
  }
  this.setState({route : route})
}

  render(){
    const {isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params = {particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange = {this.onRouteChange}/>
        {route === 'home'
        ? <div>
              <Logo />
              <Rank name = {this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm  
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>
          : (
          route === 'signIn'
          ? <SignIn loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/>
            : <Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/>
          )
      }
      </div>
    );
  }
}

export default App;
