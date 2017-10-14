import React, { Component } from 'react';
import moment from 'moment';

// eslint-disable-next-line
import weekdayCalc from 'moment-weekday-calc';
// not sure why this is working, look into just importing the weekday-calc

import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      numberOfDays: 0,
      result: "",
      resultDays: 0,
      data: this.decodeToState(),
    }
  }

  getExcludedDates = () => {
    return this.state.data.map(item => item.date);
  }

  getParams = () => {
    const searchParams = window.location.search.replace('?', '');
    return searchParams;
  };

  decodeToState = () => {
    const params = this.getParams();
    const decodedData = params === ""
      ? []
      : JSON.parse(window.atob(params));

    return decodedData;
  }

  encodeState = (data) => {
    const encoded = window.btoa(JSON.stringify(data));
    return encoded;
  }

  addToUrl = () => {
    const myNewUrlQuery = this.encodeState(this.state.data);

    if (window.history.pushState) {
      const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${myNewUrlQuery}`;
      window.history.pushState({ path:newurl },'',newurl);
    }
  }

  calculateDate = () => {
    const calculatedDate = moment()
      .addWorkdays(this.state.numberOfDays, this.getExcludedDates())
      .format('MM-DD-YYYY');

    this.setState({
      result: calculatedDate,
      resultDays: this.state.numberOfDays,
    });
  }

  setNumberOfDays = ({target}) => {
    this.setState({ numberOfDays: target.value });
  }

  render() {
    return (
      <div className="App Flex">
        <div className="Sidebar Flex Stack">
          <h3>
            Excluded Dates:
          </h3>
          <div className="SidebarContent">
            <div className="Flex Split-Around">
              <div>
                Date:
              </div>
              <div>
                Reason:
              </div>
            </div>
            {this.state.data.length === 0
                ? <div>No dates to exclude</div>
                : this.state.data.map(item => (
                  <div className="Flex Card Split">
                    <div>{item.date}</div>
                    <div>{item.reason}</div>
                  </div>
                ))
            }
          </div>
        </div>
        <div className="Main bg">
          <div class="Content Stack" >
            <div className="Control">
              <input
                className="Input round-s"
                type="number"
                onChange={this.setNumberOfDays}
                value={this.state.numberOfDays}
              />
              <button
                onClick={this.calculateDate}
                className="button button--ujarak button--border-medium button--round-s button--text-thick"
              >
                Calculate Date
              </button>
              <button
                onClick={this.addToUrl}
                className="button button--ujarak button--border-medium button--round-s button--text-thick"
              >
                Save
              </button>
            </div>
            <div className="Result Flex">
              { this.state.result &&
                  <div className="ResultContent Flex Stack">
                    <div>In <b>{this.state.resultDays}</b> working school days it will be:</div>
                    <div className="Date">{moment(this.state.result).format('dddd, MMMM Do YYYY')}</div>
                    <div className="Date">{this.state.result}</div>
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
