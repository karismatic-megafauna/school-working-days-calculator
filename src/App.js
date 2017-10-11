import React, { Component } from 'react';
import moment from 'moment';
import weekdayCalc from 'moment-weekday-calc';
import excludedDates from './excluded_dates.json';
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      numberOfDays: 0,
      result: "",
      resultDays: 0,
    }
  }

  getExcludedDates = () => {
    return excludedDates.map(item => item.date);
  }

  calculateDate = () => {
    const calculatedDate = moment()
      .addWorkdays(this.state.numberOfDays, this.getExcludedDates())
      .format('MM-DD-YYYY');

    this.setState({
      result: calculatedDate,
      resultDays: this.state.numberOfDays,
    })
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
            {excludedDates.map(item => (
              <div className="Flex Card Split">
                <div>{item.date}</div>
                <div>{item.reason}</div>
              </div>
            ))}
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
                className="button button--ujarak button--border-medium button--round-s button--text-thick">Calculate Date</button>
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
