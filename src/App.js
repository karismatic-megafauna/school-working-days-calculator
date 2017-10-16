import React, { Component } from 'react';
import moment from 'moment';
// eslint-disable-next-line
import weekdayCalc from 'moment-weekday-calc';
import excludedDates from './excluded_dates.json';
import DatePicker from 'react-datepicker';

import './App.css';
import 'react-datepicker/dist/react-datepicker.css';

/*******
 * If you are having trouble getting dates, use the `excludedDates` example data
 *******/
class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      numberOfDays: 0,
      result: "",
      resultDays: 0,
      // calculatorInfo: this.decodeToState(),
      // uncomment the above line if you want to read from the encoded URL
      calculatorInfo: excludedDates,
      startDate: moment(),
      todayDate: moment(),
    }
  }

  handleChange = (date) => {
    this.setState ({
      startDate: date,
    })
  }

  isWeekday = (date) => {
    const day = date.day()
    return day !== 0 && day !== 6
  }

  getExcludedDates = () => {
    const { calculatorInfo } = this.state;
    return calculatorInfo
      ? calculatorInfo.data.map(item => item.date)
      : '';
  }

  getParams = () => {
    const searchParams = window.location.search.replace('?', '');
    return searchParams;
  };

  decodeToState = () => {
    const params = this.getParams();
    const decodedData = params === ""
      ? undefined
      : JSON.parse(window.atob(params));

    return decodedData;
  }

  encodeState = (data) => {
    const encoded = window.btoa(JSON.stringify(data));
    return encoded;
  }

  addToUrl = () => {
    const myNewUrlQuery = this.encodeState(this.state.calculatorInfo);

    if (window.history.pushState) {
      const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${myNewUrlQuery}`;
      window.history.pushState({ path:newurl },'',newurl);
    }
  }

  calculateDate = () => {
    const resultDays = moment().isoWeekdayCalc({
      rangeStart: moment().format('DD MMM YYYY'),
      rangeEnd: this.state.startDate.format('DD MMM YYYY'),
      weekdays: [1,2,3,4,5],
      exclusions: this.getExcludedDates()
    });

    const calculatedDate = moment(this.state.startDate).format('MM-DD-YYYY');

    this.setState({
      result: calculatedDate,
      resultDays: resultDays,
    });
  }

  setNumberOfDays = ({target}) => {
    this.setState({ numberOfDays: target.value });
  }

  render() {
    const { calculatorInfo } = this.state;
    return (
      <div className="App Flex">
        <div className="Sidebar Flex Stack">
          <div className="SidebarTop Flex Split">
            <h3>
              Excluded Dates:
            </h3>
            <button
              onClick={this.addToUrl}
              className="button button--ujarak button--border-medium button--round-s button--text-thick"
            >
              Save
            </button>
          </div>
          <div className="SidebarContent">
            <div className="Flex Split-Around">
              <div>
                Date:
              </div>
              <div>
                Reason:
              </div>
            </div>
            { calculatorInfo && ( calculatorInfo.data.length === 0
                ? <div>No dates to exclude</div>
                : calculatorInfo.data.map(item => (
                  <div key={item.date} className="Flex Card Split">
                    <div>{item.date}</div>
                    <div>{item.reason}</div>
                  </div>
                ))
            )}
          </div>
        </div>
        <div className="Main Flex Stack bg">
          <div className="Title">
            { calculatorInfo && calculatorInfo.title}
          </div>
          <div className="Content Stack" >
            <div className="Control">
              <DatePicker
                selected={this.state.startDate}
                onChange={this.handleChange}
                filterDate={this.isWeekday}
                excludeDates={this.getExcludedDates()}
                minDate={this.state.todayDate}
                readOnly
              />
              <button
                onClick={this.calculateDate}
                className="button button--ujarak button--border-medium button--round-s button--text-thick"
              >
                Calculate Date
              </button>
            </div>
            <div className="Result Flex">
              { this.state.result &&
                  <div className="ResultContent Flex Stack">
                    <div>In <b>{this.state.resultDays}</b> working days it will be:</div>
                    <div className="Date">{moment(this.state.result, 'MM-DD-YYYY').format('dddd, MMMM Do YYYY')}</div>
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
