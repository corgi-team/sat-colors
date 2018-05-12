import React, { Component } from 'react';
import Banner from './components/Banner';
import GraphContainer from './components/GraphContainer';
import Settings from './components/Settings';
import './App.css';


class App extends Component {
    render() {
        return (
            <div className="App">
                <Banner />

                <div className="App-container">
                <Settings />
                <GraphContainer />
                </div>
            </div>
        );
    }
}

export default App;
