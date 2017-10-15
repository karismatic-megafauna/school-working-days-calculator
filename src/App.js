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
} from './styledComponents';
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
            {this.state.data.length === 0
                ? <div>No dates to exclude</div>
                : this.state.data.map(item => (
                  <ExcludedDate key={item.date}>
                    <div>{item.date}</div>
                    <div>{item.reason}</div>
                  </ExcludedDate>
                ))
            }
          </SidebarContent>
        </Sidebar>
        <Main>
          <Content>
            <Control>
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
                    <Date>{moment(this.state.result).format('dddd, MMMM Do YYYY')}</Date>
                    <Date>{this.state.result}</Date>
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
