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
      .addWorkdays(this.state.numberOfDays, excludedDates.data)
      .format('MM-DD-YYYY');

    this.setState({ result: calculatedDate })
  }

  setNumberOfDays = ({target}) => {
    this.setState({ numberOfDays: target.value });
  }
  render() {
    return (
      <div className="App Stack">
        <div className="Flex">
          <div>
            Excluded Dates:
          </div>
          <div>
            {excludedDates.data.map(date => <div>{date}</div>)}
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
              <div>In {this.state.numberOfDays} days it will be {this.state.result}</div>
          }
        </div>
      </div>
    );
  }
}

export default App;
