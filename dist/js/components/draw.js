const _jsxFileName = "/Users/jose/urbit/canvas/src/js/components/draw.js";import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import * as d3 from "d3";
import { parseSVG, simpleParseSVG } from "./lib/compile-svg";
import { width, height,
         initDrawCanvas, drawHexCanvas }
       from "./lib/draw-canvas";
import { ShareImage } from "./lib/share-image";
import { Spinner } from './lib/icons/icon-spinner';

// TODO: future work
// import { Runtime, Inspector } from "@observablehq/runtime";
// import notebook from "@yosoyubik/draw-me";


export class DrawCanvas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      forms: [],
      line: "1",
      color: "#000000",
      awaiting: false
    }
    this.drawRef = React.createRef();
    this.lineWidthRef = React.createRef();
    this.strokeStyleRef = React.createRef();

    this.onChangeLine = this.onChangeLine.bind(this);
    this.onChangeColor = this.onChangeColor.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
  }

  componentDidUpdate() {
    drawHexCanvas(this.props, this.state.line, this.state.color);
    if (this.state.awaiting && this.props.metadata.saved) {
      this.setState({
        awaiting: false
      });
    }
  }

  componentDidMount() {
    const { drawRef, lineWidthRef, strokeStyleRef, props, state } = this;
    // TODO: future work
    // Using observablehq makes the code cleaner encapsulating the
    // logic in a separate compoenent and interfering less with React's
    // DOM manipulation.
    //
    // const runtime = new Runtime();
    // const observer = runtime.module(notebook, name => {
    //   console.log(name);
    //   switch (name) {
    //     case "viewof exposedData":
    //       return new Inspector(drawRef.current);
    //     case "viewof lineWidth":
    //       return new Inspector(lineWidthRef.current);
    //     case "viewof strokeStyle":
    //       return new Inspector(strokeStyleRef.current);
    //   }
    // });
    //
    initDrawCanvas();
    drawHexCanvas(props, state.line, state.color);
  }

  onClickSave () {
    const { props, state } = this;
    this.setState({
      awaiting: true
    }, () => {
      const canvas = d3.select("canvas")
          .node().toDataURL("image/png").split("base64,")[1];
      const chunkSize = 700 * 2**9;
      let last = false;
      let i = 0;
      let chunks = [];
      while (i < canvas.length) {
        props.api.image.save(
          props.metadata.location,
          props.name,
          canvas.slice(i, chunkSize + i),
          ((i + chunkSize ) >= canvas.length),
          'png');
        i += chunkSize;
      }
    });
  }

  onChangeLine(event) {
    this.setState({ line: event.target.value });
  }

  onChangeColor(event) {
    this.setState({ color: event.target.value });
  }

  render() {
    const { props, state, onChangeLine, onChangeColor } = this;

    return (
      React.createElement('div', { className: "h-100 w-100 pa3 pt4 bg-gray0-d white-d flex flex-column"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 104}}
        , React.createElement('div', { className: "absolute mw5" ,
             style: {right: "20px", top: "20px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}
          
          , React.createElement(ShareImage, { chats: props.chats, name: props.name, type: 'png',
                      saved: props.metadata.saved, api: props.api, __self: this, __source: {fileName: _jsxFileName, lineNumber: 108}})
          , React.createElement('div', { className: "ml1 dib" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}
            , React.createElement('button', {
              onClick: this.onClickSave.bind(this),
              className: "pointer ml6 f9 green2 bg-gray0-d ba pv3 ph4 b--green2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}, "Save Image"

            )
            , React.createElement(Spinner, { awaiting: this.state.awaiting, classes: "absolute ml6 mt4"  , text: "Saving...", __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}} )
          )
        )
        , React.createElement('div', { ref: this.lineWidthRef, __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}
          , React.createElement('input', { id: "line", type: "range", min: "0.5", max: "20", value: this.state.line,
                 step: "0.5", style: {width:"120px"}, onChange: onChangeLine, __self: this, __source: {fileName: _jsxFileName, lineNumber: 120}} )
        )
        , React.createElement('div', { ref: this.strokeStyleRef, __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}
          , React.createElement('input', { id: "color", type: "color", style: {width:"120px"}, onChange: onChangeColor, __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}} )
        )
        , React.createElement('div', { ref: this.drawRef, __self: this, __source: {fileName: _jsxFileName, lineNumber: 126}}
          , React.createElement('canvas', { id: "canvas", width: width, height: height, __self: this, __source: {fileName: _jsxFileName, lineNumber: 127}})
        )
      )
    )
  }
}
