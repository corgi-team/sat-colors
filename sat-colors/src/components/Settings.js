import React, { Component } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

export default class Settings extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleChangeNode = this.handleChangeNode.bind(this);
        this.handleChangeColor = this.handleChangeColor.bind(this);
        this.handleSubmitNode = this.handleSubmitNode.bind(this);

        this.state = {
            colors: '',
            nodes: ''
        };
      }

      getValidationStateNumberColor() {
        if(this.state.colors == ''){
            return 'warning';
        }
        if(!isNaN(parseFloat(this.state.colors)) && isFinite(this.state.colors)){
            return 'success';
        }
        return 'error';
      }

      getValidationStateNumberNode() {
        if(!isNaN(parseFloat(this.state.nodes)) && isFinite(this.state.nodes)){
            return 'success';
        }
        return 'error';
      }

      handleChangeColor(e) {
        this.setState({ colors: e.target.value });
      }

      handleChangeNode(e) {
        this.setState({ nodes: e.target.value });
      }

      handleSubmitNode(e) {
        alert('Number of nodes: ' + this.state.nodes);
        e.preventDefault();
      }



    render() {
        return (
            <div className="Settings">
            Choose number of nodes:
            <Form inline onSubmit={this.handleSubmitNode}>
                      <FormGroup controlId="formNodesNumber" validationState={this.getValidationStateNumberNode()} inline>
                        <FormControl
                            type="text"
                            value={this.state.nodes}
                            placeholder="default: null"
                            onChange={this.handleChangeNode}
                            />
                        </FormGroup>
                        <FormControl.Feedback/>
                            <Button type="submit">Generate</Button>
            </ Form>
            Choose number of colors:
            <Form>
                      <FormGroup controlId="formColorNumber" validationState={this.getValidationStateNumberColor()}>
                        <FormControl
                            type="text"
                            value={this.state.colors}
                            placeholder="default: 3"
                            onChange={this.handleChangeColor}
                        />
                        <FormControl.Feedback />
                    </FormGroup>
            </ Form>
            </div>
        );
    }
}
