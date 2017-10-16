import React, { Component } from 'react';
import moment from 'moment';
// eslint-disable-next-line
import weekdayCalc from 'moment-weekday-calc';
import excludedDates from './excluded_dates.json';
import DatePicker from 'react-datepicker';

import './App.css';
import 'react-datepicker/dist/react-datepicker.css';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      numberOfDays: 0,
      result: "",
      resultDays: 0,
      calculatorInfo: this.decodeToState(),
      // uncomment this if you don't want to have to read from an encoded URL
      // calculatorInfo: excludedDates,
      newExclusionDate: moment(),
      newExclusionReason: '',
      startDate: moment(),
      todayDate: moment(),
    }
  }

  handleAddChange = (date) => {
    this.setState({
      newExclusionDate: date
    });
  }

  handleReasonChange = (event) => {
    event.preventDefault();
    this.setState({
      newExclusionReason: event.target.value
    });
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
    if (params === "") {
      return undefined;
    }

    const decodedData = JSON.parse(window.atob(params));

    return {
      title: decodedData.title,
      data: decodedData.data.sort(this.sortDates),
    }
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

  sortDates = (a, b) => {
    if (moment(a.date).isBefore(b.date) === true) {
      return -1;
    } else if(moment(a.date).isBefore(b.date) === false) {
      return 1;
    } else {
      return 0;
    }
  }

  addExclusionDate = () => {
    if (this.state.newExclusionReason === '') {
      return;
    }

    if (!this.state.newExclusionReason) {
      return;
    }

    let newExcludedDatesData = this.state.calculatorInfo.data;
    const newExcludedDate = {
      date: this.state.newExclusionDate.format("MM/DD/YYYY"),
      reason: this.state.newExclusionReason,
    };
    newExcludedDatesData.push(newExcludedDate);
    newExcludedDatesData = newExcludedDatesData.sort(this.sortDates);

    const newExcludedDates = Object.assign({}, this.state.calculatorInfo, { data: newExcludedDatesData });
    this.setState({
      calculatorInfo: newExcludedDates,
      newExclusionDate: moment(),
      newExclusionReason: ''
    });
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
          <div className="Content Stack">
            <div className="Control">
              <input
                type="text"
                value={this.state.newExclusionReason}
                onChange={this.handleReasonChange}
                placeholder="Enter a date exclusion reason"
                className="margin"
              />
              <DatePicker
                selected={this.state.newExclusionDate}
                onChange={this.handleAddChange}
                excludeDates={this.getExcludedDates()}
                filterDate={this.isWeekday}
                className="margin"
                readOnly
              />
              <button
                onClick={this.addExclusionDate}
                className="button margin button--ujarak button--border-medium button--round-s button--text-thick">
                Add Exclusion Date
              </button>
            </div>
          </div>
          <div className="Content Stack" >
            <div className="Control">
              <DatePicker
                selected={this.state.startDate}
                onChange={this.handleChange}
                filterDate={this.isWeekday}
                excludeDates={this.getExcludedDates()}
                minDate={this.state.todayDate}
                className="margin"
                readOnly
              />
              <button
                onClick={this.calculateDate}
                className="button margin button--ujarak button--border-medium button--round-s button--text-thick"
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
