import React, { Component } from 'react';
import moment from 'moment';
// eslint-disable-next-line
import weekdayCalc from 'moment-weekday-calc';
// not sure why this is working, look into just importing the weekday-calc
import {
  Page,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarContentHeader,
  Main,
  Content,
  Control,
  Input,
  Result,
  ResultContent,
  Date,
  ExcludedDate,
  Title,
} from './styledComponents';
// import excludedDates from './excluded_dates.json';
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
      // calculatorInfo: excludeDates,
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
      <Page>
        <Sidebar>
          <SidebarHeader>
            <h3>
              Excluded Dates:
            </h3>
            <button
              onClick={this.addToUrl}
              className="button button--ujarak button--border-medium button--round-s button--text-thick"
            >
              Save
            </button>
          </SidebarHeader>
          <SidebarContent>
            <SidebarContentHeader>
              <div>
                Date:
              </div>
              <div>
                Reason:
              </div>
            </SidebarContentHeader>
            { calculatorInfo.data && calculatorInfo.data.length !== 0
                ? calculatorInfo.data.map(item => (
                  <ExcludedDate key={item.date}>
                    <div>{item.date}</div>
                    <div>{item.reason}</div>
                  </ExcludedDate>
                ))
                : <div>No dates to exclude</div>
            }
          </SidebarContent>
        </Sidebar>
        <Main>
          <Title>
            { calculatorInfo && calculatorInfo.title}
          </Title>
          <Content>
            <Control>
              <DatePicker
                selected={this.state.startDate}
                onChange={this.handleChange}
                filterDate={this.isWeekday}
                excludeDates={this.getExcludedDates()}
                minDate={this.state.todayDate}
                readOnly
              />
              <Input
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
            </Control>
            <Result>
              { this.state.result &&
                  <ResultContent>
                    <div>In <b>{this.state.resultDays}</b> working days it will be:</div>
                    <Date>{moment(this.state.result, 'MM-DD-YYYY').format('dddd, MMMM Do YYYY')}</Date>
                    <Date className="Date">{this.state.result}</Date>
                  </ResultContent>
              }
            </Result>
          </Content>
        </Main>
      </Page>
    );
  }
}

export default App;
