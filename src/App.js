import React, { Component } from 'react';
import moment from 'moment';
// eslint-disable-next-line
import weekdayCalc from 'moment-weekday-calc';
import excludedDates from './excluded_dates.json';
// not sure why this is working, look into just importing the weekday-calc
import {
  Page,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarContentHeader,
  ScrollContainer,
  Main,
  Content,
  Control,
  Input,
  Result,
  ResultContent,
  Date,
  ExcludedDate,
  ExcludedData,
  ExcludedRemoveButton,
  Title,
  ExclusionInput,
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
      calculatorInfo: excludedDates,
      newExclusionDate: moment(),
      newExclusionReason: '',
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
      return {title: '', data: []};
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

  removeExclusion = (idToRemove) => {
    const { calculatorInfo } = this.state;
    const dataWithRemovedItem = calculatorInfo.data.filter((_, id) => {
      return id !== idToRemove;
    });

    this.setState({
      calculatorInfo: {
        data: dataWithRemovedItem,
        title: calculatorInfo.title,
      }
    });
  }

  render() {
    const { calculatorInfo } = this.state;
    return (
      <Page>
        <Sidebar>
          <div>
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
          </div>
          <ScrollContainer>
          <SidebarContent>
            <SidebarContentHeader>
              <tr>
              <th>
                Date:
              </th>
              <th>
                Reason:
              </th>
              </tr>
            </SidebarContentHeader>
            
            { calculatorInfo && ( calculatorInfo.data.length === 0
              ? <div>No dates to exclude</div>
              : calculatorInfo.data.map((item, id)=> (
                <ExcludedDate key={item.date}>
                  <ExcludedData>{item.date}</ExcludedData>
                  <ExcludedData>{item.reason}</ExcludedData>
                  <ExcludedRemoveButton onClick={() => this.removeExclusion(id)}>X</ExcludedRemoveButton>
                </ExcludedDate>
              ))
            )}
          </SidebarContent>
          </ScrollContainer>
        </Sidebar>
        <Main>
          <Title>
            { calculatorInfo && calculatorInfo.title }
          </Title>
          <Content>
            <Control>
              <ExclusionInput
                type="text"
                value={this.state.newExclusionReason}
                onChange={this.handleReasonChange}
                placeholder="Enter exclusion reason"
              />
              <DatePicker
                selected={this.state.newExclusionDate}
                onChange={this.handleAddChange}
                excludeDates={this.getExcludedDates()}
                filterDate={this.isWeekday}
                className="margin"
                readOnly
              />
              <Input
                type="number"
                onChange={this.setNumberOfDays}
                value={this.state.numberOfDays}
              />
              <button
                onClick={this.addExclusionDate}
                className="button margin button--ujarak button--border-medium button--round-s button--text-thick">
                Add Exclusion Date
              </button>
            </Control>
          </Content>
          <Content>
            <Control>
              <input
                type="number"
                onChange={this.setNumberOfDays}
              />
              <button
                onClick={this.calculateDate}
                className="button margin button--ujarak button--border-medium button--round-s button--text-thick"
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
