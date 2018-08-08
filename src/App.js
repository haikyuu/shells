import React, { Component } from "react";
import "./App.css";
import GameScreen from "./screens/GameScreen";

class App extends Component {
  render() {
    return (
      <div className="App">
        <GameScreen />
      </div>
    );
  }
}

export default App;
