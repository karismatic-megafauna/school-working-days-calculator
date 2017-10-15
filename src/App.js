import React, { Component } from "react";
import moment from "moment";
import styled from "styled-components";
// eslint-disable-next-line
import weekdayCalc from "moment-weekday-calc";
// import excludedDates from './excluded_dates.json';
import DatePicker from "react-datepicker";

import "./App.css";
import "react-datepicker/dist/react-datepicker.css";

const Container = styled.div`
  display: flex;
  font-size: 16px;
  height: 100vh;
`;

const SideBar = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 25%;
  background: #f1f1f1;
  padding: 0px 6px;
`;

const SideBarTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SideBarContent = styled.div`
  margin: 6px;
  overflow-y: scroll;
`;

const SplitAround = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  background: #ddd;
  padding: 12px;
  margin: 6px 0px;
`;

const Main = styled.div`
  display: flex;
  flex: 1 1 75%;
  flex-direction: column;
  background: #7986cb;
  color: #eceff1;
`;

const Title = styled.div`
  height: 50%;
  padding: 20px;
  font-size: 24px;
`;

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: column;
  height: 50%;
`;

const Control = styled.div`
  display: flex;
  align-items: center;
`;

const Result = styled.div`
  height: 100px;
  align-items: center;
  justify-content: center;
  display: flex;
`;

const ResultContent = styled.div`
  height: 100%;
  justify-content: space-evenly;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfDays: 0,
      result: "",
      resultDays: 0,
      calculatorInfo: this.decodeToState(),
      // uncomment this if you don't want to have to read from an encoded URL
      // calculatorInfo: excludeDates,
      startDate: moment(),
      todayDate: moment()
    };
  }

  handleChange = date => {
    this.setState({
      startDate: date
    });
  };

  isWeekday = date => {
    const day = date.day();
    return day !== 0 && day !== 6;
  };

  getExcludedDates = () => {
    const { calculatorInfo } = this.state;
    return calculatorInfo ? calculatorInfo.data.map(item => item.date) : "";
  };

  getParams = () => {
    const searchParams = window.location.search.replace("?", "");
    return searchParams;
  };

  decodeToState = () => {
    const params = this.getParams();
    const decodedData =
      params === "" ? undefined : JSON.parse(window.atob(params));

    return decodedData;
  };

  encodeState = data => {
    const encoded = window.btoa(JSON.stringify(data));
    return encoded;
  };

  addToUrl = () => {
    const myNewUrlQuery = this.encodeState(this.state.calculatorInfo);

    if (window.history.pushState) {
      const newurl = `${window.location.protocol}//${window.location
        .host}${window.location.pathname}?${myNewUrlQuery}`;
      window.history.pushState({ path: newurl }, "", newurl);
    }
  };

  calculateDate = () => {
    const resultDays = moment().isoWeekdayCalc({
      rangeStart: moment().format("DD MMM YYYY"),
      rangeEnd: this.state.startDate.format("DD MMM YYYY"),
      weekdays: [1, 2, 3, 4, 5],
      exclusions: this.getExcludedDates()
    });

    const calculatedDate = moment(this.state.startDate).format("MM-DD-YYYY");

    this.setState({
      result: calculatedDate,
      resultDays: resultDays
    });
  };

  setNumberOfDays = ({ target }) => {
    this.setState({ numberOfDays: target.value });
  };

  render() {
    const { calculatorInfo } = this.state;
    return (
      <Container>
        <SideBar>
          <SideBarTop>
            <h3>Excluded Dates:</h3>
            <button
              onClick={this.addToUrl}
              className="button button--ujarak button--border-medium button--round-s button--text-thick"
            >
              Save
            </button>
          </SideBarTop>
          <SideBarContent>
            <SplitAround>
              <div>Date:</div>
              <div>Reason:</div>
            </SplitAround>
            {calculatorInfo &&
              (calculatorInfo.data.length === 0 ? (
                <div>No dates to exclude</div>
              ) : (
                calculatorInfo.data.map(item => (
                  <Card key={item.date}>
                    <div>{item.date}</div>
                    <div>{item.reason}</div>
                  </Card>
                ))
              ))}
          </SideBarContent>
        </SideBar>
        <Main>
          <Title>{calculatorInfo && calculatorInfo.title}</Title>
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
              <button
                onClick={this.calculateDate}
                className="button button--ujarak button--border-medium button--round-s button--text-thick"
              >
                Calculate Date
              </button>
            </Control>
            <Result>
              {this.state.result && (
                <ResultContent>
                  <div>
                    In <b>{this.state.resultDays}</b> working days it will be:
                  </div>
                  <div className="Date">
                    {moment(this.state.result).format("dddd, MMMM Do YYYY")}
                  </div>
                  <div className="Date">{this.state.result}</div>
                </ResultContent>
              )}
            </Result>
          </Content>
        </Main>
      </Container>
    );
  }
}

export default App;
