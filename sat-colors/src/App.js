import React, { Component } from 'react';
import Banner from './components/Banner';
import GraphContainer from './components/GraphContainer';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Banner />
                <GraphContainer />
            </div>
        );
    }
}

export default App;
