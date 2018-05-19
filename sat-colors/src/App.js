import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import ModalGenerateNodes from './components/ModalGenerateNodes';
import ModalSat from './components/ModalSat';
import axios from 'axios';
import '../node_modules/vis/dist/vis.css';
import './App.css';


// options for vis.js
let vis = require('vis');
var network;
var options;
var id = 0;


class App extends Component {
    constructor() {
        super();

        this.state = {
            modalNodes : false,
            modalSat : false,
            loading: false
        }

        this.addNode = this.addNode.bind(this);
        this.showModalNodes = this.showModalNodes.bind(this);
        this.handleGenerateNodes = this.handleGenerateNodes.bind(this);
        this.showModalSat = this.showModalSat.bind(this);
        this.handleSat = this.handleSat.bind(this);
        this.generateColors = this.generateColors.bind(this);
        this.hslToHex = this.hslToHex.bind(this);
        this.exportNetwork = this.exportNetwork.bind(this);
        this.objectToArray = this.objectToArray.bind(this);
        this.addConnections = this.addConnections.bind(this);
        this.generateLinks = this.generateLinks.bind(this);
        this.checkLinks = this.checkLinks.bind(this);
        this.generateNodes = this.generateNodes.bind(this);
        this.generateSolutons = this.generateSolutons.bind(this);
        this.generateArrayNodes = this.generateArrayNodes.bind(this);
        this.generateArrayEdges = this.generateArrayEdges.bind(this);
    }

    componentDidMount() {
        // Initialize the graph (the graph will be empty at the beginning)
        let nodes = new vis.DataSet([]);
        let edges = new vis.DataSet([]);

        options = {
            manipulation: {
                enabled: true,
                initiallyActive: true,
                deleteNode: true,
                deleteEdge: true,
                addNode: this.addNode
            },
            edges: {
                smooth: {
                    forceDirection: "none",
                    roundness: 0.15
                }
            },
            physics: {
                minVelocity: 0.75
            },
            nodes: {
                borderWidth: 1,
                borderWidthSelected: 2,
                color: {
                    border: '#000',
                    background: '#fff',
                    highlight: {
                        border: '#000',
                        background: '#e3e3e3'
                    }
                },
                font : {
                    color: '#000',
                    align: 'center',
                },
                shape: 'ellipse'
            },
        };

        let data = {
            nodes: nodes,
            edges: edges
        }

        var graphContainer = document.getElementById('graph');
        network = new vis.Network(graphContainer, data, options);
    }

    // TODO: modify label
    addNode(node, callback) {
        node.label = id.toString();
        node.id = id;
        id += 1;

        callback(node);
    }

    showModalNodes() {
        this.setState({
            modalNodes : !this.state.modalNodes
        })
    }

    handleGenerateNodes(numberOfNodes) {
        var nodes = [];
        var edges = [];
        var connectionCount = [];

        // var positions = this.generatePositionsArray();

        // Randomly create some nodes and edges
        for (let i = 0; i < numberOfNodes; i++) {
            nodes.push({
                id: i,
                label: String(i),
                // x : this.getRandomPosition(positions, true).x,
                // y : this.getRandomPosition(positions, true).y
            })

            connectionCount[i] = 0;

            // create edges in a scale-free-network way
            if (i == 1) {
                var from = i;
                var to = 0;
                edges.push({
                    from: from,
                    to: to
                })

                connectionCount[from]++;
                connectionCount[to]++;
            } else if (i > 1) {
                var conn = edges.length * 2;
                var rand = Math.floor(Math.random() * conn);
                var cum = 0;
                var j = 0;

                while (j < connectionCount.length && cum < rand) {
                    cum += connectionCount[j];
                    j++;
                }

                var from = i;
                var to = j;
                edges.push({
                    from: from,
                    to: to
                })

                connectionCount[from]++;
                connectionCount[to]++;
            }
        }

        let data = {
            nodes: nodes,
            edges: edges
        }

        this.setState({
            modalNodes: false
        })
        
        id = numberOfNodes;

        var graphContainer = document.getElementById('graph');
        network = new vis.Network(graphContainer, data, options);
    }

    showModalSat() {
        this.setState({
            modalSat: !this.state.modalSat
        })
    }

    handleSat(numberOfColors) {
        var nodes = this.exportNetwork();

        let jsonFile = {
            colors : this.generateColors(numberOfColors),
            links : this.generateLinks(nodes),
            nodes : this.generateNodes(nodes)
        }
        
        // post
        this.setState({
            loading: true
        })
        axios.post('/problem', jsonFile)
        .then(res => {
            this.generateSolutons(nodes, res.data);
        })
        .catch(err => console.log(err))
    }

    // StackOverflow is love, StackOverflow is life
    generateColors(number) {
        let colors = [];
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

    exportNetwork() {
        var nodes = this.objectToArray(network.getPositions());
        nodes.forEach(this.addConnections);
        return nodes;
    }

    // Create the object with x, y and id
    objectToArray(object) {
        return Object.keys(object).map((key) => {
            object[key].id = key;
            return object[key];
        });
    }

    // Find the connections for each node
    addConnections(node) {
        node.connections = network.getConnectedNodes(node.id);
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

    generateSolutons(nodes, data) {
        let newNodes = [];

        for (let i = 0; i < data.solutions.length; i++) {
            let foundNode = nodes.find(node => node.id == data.solutions[i].node);

            if (foundNode) {
                foundNode.color = data.solutions[i].color;
                newNodes.push(foundNode)
            }
        }
        
        let finalNodes = this.generateArrayNodes(newNodes);
        let finalEdges = this.generateArrayEdges(newNodes);
        
        let finalData = {
            nodes: finalNodes,
            edges: finalEdges
        }

        this.setState({
            modalSat: false,
            loading: false
        })

        var graphContainer = document.getElementById('graph');
        network = new vis.Network(graphContainer, finalData, options);
    }

    generateArrayNodes(nodes) {
        let newNodes = [];
        for (let node of nodes) {
            let newNode = {
                id: node.id,
                x: node.x,
                y: node.y,
                color: node.color
            }

            newNodes.push(newNode)
        }
        return newNodes;
    }  

    // RIMUOVI DUPLICATE EDGES
    generateArrayEdges(nodes) {
        let edges = this.generateLinks(nodes);
        let finalEdges = [];

        for (let i = 0; i < edges.length; i++) {
            let edge = {
                from: edges[i][0],
                to: edges[i][1],
                id: `edge-${i}`
            }
            finalEdges.push(edge)
        }

        return finalEdges
    }

    render() {
        return (
            <div className="App">
                <div className="App-container">
                    <div className="GraphContainer--container">
                        <div id="graph">
                        </div>
                    </div>

                    <div className="Buttons-container">
                        <Button bsStyle="primary" onClick={() => this.showModalNodes()}>Create random graph</Button>
                        <Button bsStyle="primary" onClick={() => this.showModalSat()}>Sat solver</Button>
                    </div>
                </div>

                {this.state.modalNodes && (
                    <ModalGenerateNodes 
                        showModal={this.state.modalNodes}
                        close={this.showModalNodes}
                        handleGenerateNodes={this.handleGenerateNodes}
                    />
                )}

                {this.state.modalSat && (
                    <ModalSat 
                        showModal={this.state.modalSat}
                        close={this.showModalSat}
                        handleSat={this.handleSat}
                        loading={this.state.loading}
                    />
                )}
            </div>
        );
    }
}

export default App;
