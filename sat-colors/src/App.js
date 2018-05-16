import React, { Component } from 'react';
import Banner from './components/Banner';
import GraphContainer from './components/GraphContainer';
import Settings from './components/Settings';
import dogGif from './img/hello-dog.gif';
import axios from 'axios';
import './App.css';


class App extends Component {
    constructor() {
        super();

        this.state = {
            finalJSON : {},
            colors: null,
            nodes: null,
            generatedNodes : [],
            generatedEdges : [],
        }

        this.generateJSON = this.generateJSON.bind(this);
        this.generateColors = this.generateColors.bind(this);
        this.generateLinks = this.generateLinks.bind(this);
        this.checkLinks = this.checkLinks.bind(this);
        this.generateNodes = this.generateNodes.bind(this);
        this.handleChangeColor = this.handleChangeColor.bind(this);
        this.handleChangeNodes = this.handleChangeNodes.bind(this);
        this.hslToHex = this.hslToHex.bind(this);
        this.generateRandomNodes = this.generateRandomNodes.bind(this);

        this.getRandomInt = this.getRandomInt.bind(this);
        this.getRandomPosition = this.getRandomPosition.bind(this);
        this.generatePositionsArray = this.generatePositionsArray.bind(this);
    }

    generateJSON(nodes) {
        let jsonFile = {
            colors : this.generateColors(),
            links : this.generateLinks(nodes),
            nodes : this.generateNodes(nodes)
        }

        // post
        axios.post('/problem', jsonFile)
            .then(res => {
                console.log(res.data);
            })

        // console.log('send to python')
        // console.log(jsonFile)
    }

    // StackOverflow is love, StackOverflow is life
    generateColors() {
        let number = this.state.colors ? Number(this.state.colors) : 3
        let colors = []
        for (let i = 0; i < 360; i += 360 / number) {
            let hue = i;
            let saturation = 90 + Math.random() * 10;
            let lightness = 50 + Math.random() * 10;
            colors.push(this.hslToHex(hue, saturation, lightness));
        }
        return colors;
    }

    hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;
        if (s === 0) {
          r = g = b = l; // achromatic
        } else {
          const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
          };
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          r = hue2rgb(p, q, h + 1 / 3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1 / 3);
        }
        const toHex = x => {
          const hex = Math.round(x * 255).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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

    handleChangeNodes(nodes) {
        this.setState({
            nodes: nodes
        })

        this.generateRandomNodes(nodes)
    }

    // Returns a random integer between min (included) and max (excluded)
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


    // generate random positions
    generatePositionsArray() {
        var maxX = 1600;
        var maxY = 800;
        var safeRadius = 2;
        var irregularity = 300;

        // declarations
        var positionsArray = [];
        var r, c;
        var rows;
        var columns;

        // count the amount of rows and columns
        rows = Math.floor(maxY / safeRadius);
        columns = Math.floor(maxX / safeRadius);

        // loop through rows
        for (r = 1; r <= rows; r += 1) {
            // loop through columns
            for (c = 1; c <= columns; c += 1) {
                // populate array with point object
                positionsArray.push({
                    x: Math.round(maxX * c / columns) + this.getRandomInt(irregularity * -1, irregularity),
                    y: Math.round(maxY * r / rows) + this.getRandomInt(irregularity * -1, irregularity)
                });
            }
        }
        // return array
        return positionsArray;
    }

    // get random position from positions array
    getRandomPosition(array, removeTaken) {

        // declarations
        var randomIndex;
        var coordinates;

        // get random index
        randomIndex = this.getRandomInt(0, array.length - 1);

        // get random item from array
        coordinates = array[randomIndex];

        // check if remove taken
        if (removeTaken) {
            // remove element from array
            array.splice(randomIndex, 1);
        }

        // return position
        return coordinates;
    }

    generateRandomNodes(nodes) {
        var generatedNodes = [];
        var generatedEdges = [];
        var connectionCount = [];

        var positions = this.generatePositionsArray();

        // Randomly create some nodes and edges
        for (let i = 0; i < nodes; i++) {
            generatedNodes.push({
                id: i,
                label: String(i),
                x : this.getRandomPosition(positions, true).x,
                y : this.getRandomPosition(positions, true).y
            })

            connectionCount[i] = 0;

            // create edges in a scale-free-network way
            if (i == 1) {
                var from = i;
                var to = 0;
                generatedEdges.push({
                    from: from,
                    to: to
                })

                connectionCount[from]++;
                connectionCount[to]++;
            } else if (i > 1) {
                var conn = generatedEdges.length * 2;
                var rand = Math.floor(Math.random() * conn);
                var cum = 0;
                var j = 0;

                while (j < connectionCount.length && cum < rand) {
                    cum += connectionCount[j];
                    j++;
                }

                var from = i;
                var to = j;
                generatedEdges.push({
                    from: from,
                    to: to
                })

                connectionCount[from]++;
                connectionCount[to]++;
            }
        }

        this.setState({
            generatedNodes: generatedNodes,
            generatedEdges: generatedEdges
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
                    handleChangeNodes={this.handleChangeNodes}
                    nodes={this.state.nodes}
                />
                <div>
                    {/* <div id="gif-dog">
                        <img src={dogGif}/>
                    </div> */}
                    <GraphContainer
                        generateJSON={this.generateJSON}
                        nodes={this.state.nodes}
                        generatedNodes={this.state.generatedNodes}
                        generatedEdges={this.state.generatedEdges}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
