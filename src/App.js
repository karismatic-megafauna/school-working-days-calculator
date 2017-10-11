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
    }
  }

  calculateDate = () => {
    const calculatedDate = moment()
      .addWorkdays(this.state.numberOfDays, excludedDates)
      .format('MM-DD-YYYY');

    this.setState({ result: calculatedDate })
  }

  setNumberOfDays = ({target}) => {
    this.setState({ numberOfDays: target.value });
  }
  render() {
    return (
      <div className="App">
        <div className="Flex">
          <div>
            Excluded Dates:
          </div>
          <div>
            {excludedDates.map(item => (
              <div className="Flex Card Split">
                <div>{item.date}</div>
                <div>{item.reason}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <input
            type="number"
            onChange={this.setNumberOfDays}
            value={this.state.numberOfDays}
          />
          <button onClick={this.calculateDate}>
            Calculate Date
          </button>
          { this.state.result &&
              <div>In {this.state.numberOfDays} working school days it will be {this.state.result}</div>
          }
        </div>
      </div>
    );
  }
}

export default App;
