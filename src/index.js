import 'aframe';
import 'aframe-animation-component';
import 'aframe-particle-system-component';
import 'aframe-forcegraph-component'
import 'babel-polyfill';
import {Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import wtf from 'wtf_wikipedia'


const getData = (searchTerm, callback) => {
  wtf.from_api(searchTerm, 'en', function(markup) {
    const data = wtf.parse(markup);
    const related = data.sections.filter((s) => s.title === "See also")[0].lists[0]

    let graph = {
      nodes: [],
      links: [],
    }

    graph.nodes.push({id: searchTerm, name: searchTerm})
    related.forEach((sentence, index) => {
      graph.nodes.push({"id": sentence.text, "name": sentence.text, "group": index})
      graph.links.push({
            "source": searchTerm,
            "target": sentence.text
        })
    })

    callback(graph)
  });
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        "nodes": [
            {
              "id": "id1",
              "name": "name1",
              "val": 1
            },
            {
              "id": "id2",
              "name": "name2",
              "val": 10
            },
        ],
        "links": [
            {
                "source": "id1",
                "target": "id2"
            },
        ]
    }
  }

  componentDidMount() {
    getData("basketball", (graph) => this.setState(graph))
  }

  render () {
    return (
      <a-scene stats>
        <a-entity camera="userHeight: 1.6" wasd-controls="fly: true; acceleration: 3000" look-controls>
          <a-cursor color="lavender" opacity="0.5"></a-cursor>
        </a-entity>
        <a-sky color="darkblue"></a-sky>

        <a-entity forcegraph={"nodes: "+JSON.stringify(this.state.nodes)+"; links: "+JSON.stringify(this.state.links)+"; node-auto-color-by: group"}></a-entity>

      </a-scene>
    );
  }
}

ReactDOM.render(<App/>, document.querySelector('#sceneContainer'));
