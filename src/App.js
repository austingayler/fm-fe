import React, { Component } from 'react';
import ReactTable from "react-table";
import Popup from "reactjs-popup";

import MapContainer from './MapContainer';

import 'react-table/react-table.css'
import logo from './snowflake.svg';
import './App.css';
import lines from './off-pistes.json';

const columns = [
  {
    Header: "Name",
    accessor: "name",
    width: 300
  },
  {
    Header: "Difficulty",
    accessor: "ski_difficulty",
    width: 150
  },
  {
    Header: "Summary",
    accessor: "short_description",
    sortable: false
  }
]

class App extends Component {
  constructor() {
    super();
    this.state = {
      selected: null
    };
    this.closePopup = this.closePopup.bind(this);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Off-piste Ski Lines</h1>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <ReactTable
          className="-striped -highlight"
          data={this.makeData()}
          columns={columns}
          showPageJump={false}
          defaultSorted={[
            {
              id: "name",
              desc: false
            }
          ]}
          getTrProps={(state, rowInfo) => {
            const clickable = rowInfo && !!rowInfo.original.geo_data;

            return {
              onClick: (e, handleOriginal) => {
                if (!clickable) return;

                this.setState({
                  selected: rowInfo.original
                });
              },
              style: {
                cursor: clickable ? "pointer" : "default"
              }
            }
          }}
        />
        <Popup
          open={!!this.state.selected}
          closeOnDocumentClick
          onClose={this.closePopup}
        >
          <div className="modal">
            <MapContainer {...this.state.selected} />
          </div>
        </Popup>
        <div>Snowflake icon from <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a></div>
      </div>
    );
  }

  closePopup() {
    this.setState({ selected: null });
  }

  makeData() {
    //maybe do some preprocessing?
    return lines;
  }

}

export default App;
