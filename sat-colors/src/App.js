import React, { Component } from 'react';
import Banner from './components/Banner';
import GraphContainer from './components/GraphContainer';
import Settings from './components/Settings';
import './App.css';


class App extends Component {
    constructor() {
        super();

        this.state = {
            finalJSON : {},
            colors: null
        }

        this.generateJSON = this.generateJSON.bind(this);
        this.generateColors = this.generateColors.bind(this);
        this.generateLinks = this.generateLinks.bind(this);
        this.checkLinks = this.checkLinks.bind(this);
        this.generateNodes = this.generateNodes.bind(this);
        this.handleChangeColor = this.handleChangeColor.bind(this);
    }

    generateJSON(nodes) {
        let jsonFile = {
            colors : this.generateColors(),
            links : this.generateLinks(nodes),
            nodes : this.generateNodes(nodes)
        }

        console.log('send to python')
        console.log(jsonFile)
    }

    // thanks stackoverflow
    generateColors() {
        var letters = '0123456789ABCDEF';
        let colors = []
        let number = this.state.colors ? Number(this.state.colors) : 3
        for (let y = 0; y < number; y++) {
            let color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            colors.push(color)
        }
        return colors;
    }

    generateLinks(nodes) {
        let links = []
        for (let node of nodes) {
            for (let connection of node.connections) {
                let link = [Number(node.id), connection]
                link.sort()

                if (!this.checkLinks(links, link)) {
                    links.push(link)
                }
            }
        }
        return links;
    }

    checkLinks(links, link) {
        let i, current;
        let check = false;
        for (i = 0; i < links.length; i++) {
            current = links[i];
            
            if ((current[0] == link[0]) && (current[1] == link[1])) {
                return true
            }
        }
        return false
    }

    generateNodes(nodes) {
        let array = [];

        for (let node of nodes) {
            array.push(Number(node.id))
        }

        return array;
    }

    handleChangeColor(e) {
        this.setState({
            colors: e.target.value
        })
    }

    render() {
        return (
            <div className="App">
                <Banner />

                <div className="App-container">
                <Settings 
                    colors={this.state.colors}
                    handleChangeColor={this.handleChangeColor}
                />
                <GraphContainer 
                    generateJSON={this.generateJSON}/>
                </div>
            </div>
        );
    }
}

export default App;
