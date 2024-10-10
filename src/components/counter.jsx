import React, { Component } from "react";

class Counter extends Component {
  state = {
    count: "zero",
    imageUrl: "https://picsum.photos/200",
  };
  render() {
    return (
      <div>
        <span className="badge badge-warning m-2">{this.state.count}</span>
        <button className="btn btn-secondary btn-sm">Increment</button>
      </div>
    );
  }
}

export default Counter;
