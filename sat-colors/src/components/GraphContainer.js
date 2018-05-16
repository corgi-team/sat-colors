import React, { Component } from 'react';
import '../../node_modules/vis/dist/vis.css';
import {Button } from 'react-bootstrap';

let vis = require('vis');
var network;

var options;
var id = 0;

export default class GraphContainer extends Component {
    constructor() {
        super();

        this.state = {
            values : []
        }

        this.exportNetwork = this.exportNetwork.bind(this);
        this.objectToArray = this.objectToArray.bind(this);
        this.addConnections = this.addConnections.bind(this);
        this.addNode = this.addNode.bind(this);
    }

    // function to generate a graph given a number of nodes
    randomGenerateGraph(numberNodes){
        // let nodes = new vis.DataSet([]);
        // let edges = new vis.DataSet([]);

        var nodes = [];
        var edges = [];
        var connectionCount = [];

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

        // randomly create some nodes and edges
        for (var i = 0; i < numberNodes; i++) {
          nodes.push({
            id: i,
            label: String(i)
          });

          connectionCount[i] = 0;

          // create edges in a scale-free-network way
          if (i == 1) {
            var from = i;
            var to = 0;
            edges.push({
              from: from,
              to: to
            });
            connectionCount[from]++;
            connectionCount[to]++;
          }
          else if (i > 1) {
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
            });
            connectionCount[from]++;
            connectionCount[to]++;
          }
        }

        let data = {
            nodes: nodes,
            edges: edges
        }

        var graphContainer = document.getElementById('graph');
        network = new vis.Network(graphContainer, data, options);
        // return {nodes:nodes, edges:edges};
    }

    componentDidMount() {
        // Initialize the graph
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
