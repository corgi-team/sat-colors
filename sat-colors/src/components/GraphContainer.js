import React, { Component } from 'react';
import '../../node_modules/vis/dist/vis.css';
import {Button } from 'react-bootstrap';

let vis = require('vis');
var network;

var options;
var id = 0;

export default class GraphContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            values : [],
            nodes: props.generatedNodes,
            edges: props.generatedEdges
        }

        this.exportNetwork = this.exportNetwork.bind(this);
        this.objectToArray = this.objectToArray.bind(this);
        this.addConnections = this.addConnections.bind(this);
        this.addNode = this.addNode.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            nodes: newProps.generatedNodes,
            edges: newProps.generatedEdges
        })

        id = newProps.generatedNodes.length

        let data = {
            nodes: newProps.generatedNodes,
            edges: newProps.generatedEdges
        }

        options = {
            manipulation: {
                enabled: true,
                initiallyActive: true,
                deleteNode: true,
                deleteEdge: true,
                addNode: this.addNode
            },
            physics: {
                enabled: false,
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
            edges:{
                color:{
                    inherit: 'both'
                }
            },
            layout: {
                randomSeed: undefined
            }
        };

        var graphContainer = document.getElementById('graph');
        network = new vis.Network(graphContainer, data, options);
    }

    componentDidMount() {
        // Initialize the graph
        let nodes = this.state.nodes;
        let edges = this.state.edges;

        options = {
            manipulation: {
                enabled: true,
                initiallyActive: true,
                deleteNode: true,
                deleteEdge: true,
                addNode: this.addNode
            },
            physics: {
                enabled: false,
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

    addNode(node, callback) {
        node.label = id.toString();
        node.id = id;
        id += 1;

        callback(node);
    }

    exportNetwork() {
        var nodes = this.objectToArray(network.getPositions());
        nodes.forEach(this.addConnections);

        this.props.generateJSON(nodes)
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

    render() {
        return (
            <div className="GraphContainer--container">
                <Button onClick={this.exportNetwork}>SAT</Button>
                <div id="graph">
                </div>
            </div>
        );
    }
}
