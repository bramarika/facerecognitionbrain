import React, { Component } from 'react';
import Navigation from './components/navigation/Navigation'
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import './App.css';

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
        {/*<FaceRecognition />*/}
      </div>
    );
  }
}

export default App;
