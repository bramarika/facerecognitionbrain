import React, { Component } from 'react';
import Navigation from './components/navigation/Navigation'
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import './App.css';

//Clarifai API import
import Clarifai from 'clarifai';

//initializing with the API key.
const app = new Clarifai.App({
 apiKey: '403fe53c1d5443ed9aeace2b39b21b3b'
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
    }
  }
  onInputChange = (event) => {
    console.log(event.target.value);
  }
  onButtonSubmit = () => {
    console.log('click');
    app.models
      .predict(
        Clarifai., 
        "https://samples.clarifai.com/face-det.jpg")
      .then(
      function(response){
        console.log(response);
      },
      function(err){

      });
  }
  render(){
    return (
      <div className="App">
      <Particles className='particles'
        params={particlesOptions}
      />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm  
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition />
      </div>
    );
  }
}

export default App;
