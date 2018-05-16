import React, { Component } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

export default class Settings extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            nodes: props.nodes
        }

        this.getValidationStateNumberColor = this.getValidationStateNumberColor.bind(this);
        this.getValidationStateNumberNode = this.getValidationStateNumberNode.bind(this);
        this.handleChangeNode = this.handleChangeNode.bind(this);
        this.handleSubmitNode = this.handleSubmitNode.bind(this);
    }

    getValidationStateNumberColor() {
        if (this.props.colors == '') {
            return 'warning';
        }
        if (!isNaN(parseFloat(this.props.colors)) && isFinite(this.props.colors)) {
            return 'success';
        }
        return 'error';
    }

    getValidationStateNumberNode() {
        if (!isNaN(parseFloat(this.state.nodes)) && isFinite(this.state.nodes)) {
            return 'success';
        }
        return 'error';
    }

    handleChangeNode(e) {
        this.setState({
            nodes: e.target.value
        })
    }

    handleSubmitNode(e) {
        this.props.handleChangeNodes(this.state.nodes)
    }

    render() {
        return (
            <div className="Settings">
                Choose number of nodes:
                <div className="nodes-container">
                    <FormGroup controlId="formNodesNumber" validationState={this.getValidationStateNumberNode()}>
                        <FormControl
                            type="text"
                            value={this.state.nodes}
                            placeholder="default: null"
                            onChange={this.handleChangeNode}
                        />
                    </FormGroup>
                    <Button type="submit" onClick={this.handleSubmitNode}>Generate</Button>
                </div>

                Choose number of colors:
                  <FormGroup controlId="formColorNumber" validationState={this.getValidationStateNumberColor()}>
                        <FormControl
                            type="text"
                            value={this.state.colors}
                            placeholder="default: 3"
                            onChange={this.props.handleChangeColor}
                        />
                      <FormControl.Feedback />
                  </FormGroup>
            </div>
        );
    }
}
