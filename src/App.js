import React, { Component } from 'react';
import moment from 'moment';
import FontAwesome from 'react-fontawesome';
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
  TitleInput,
  Input,
  Result,
  ResultContent,
  Date,
  ExcludedDate,
  ExcludedData,
  // ExcludedRemoveButton, // Not used now
  Title,
  ExclusionInput,
} from './styledComponents';
import DatePicker from 'react-datepicker';
import Scrim from './Scrim';
import Button from './Button';

import './App.css';
import 'react-datepicker/dist/react-datepicker.css';

class App extends Component {
  constructor(props){
    super(props)
    // set this to <false> if you don't want to have to read from an encoded URL, <true> instead
    const readFromEncodedUrl = false;
    this.state = {
      numberOfDays: 0,
      result: "",
      resultDays: 0,
      calculatorInfo: readFromEncodedUrl ? this.decodeToState() : excludedDates,
      hoverDate: '',
      // uncomment this if you don't want to have to read from an encoded URL
      newExclusionDate: moment(),
      newExclusionReason: '',
      isEditing: false,
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
  };

  encodeState = (data) => {
    const encoded = window.btoa(JSON.stringify(data));
    return encoded;
  };

  addToUrl = () => {
    const myNewUrlQuery = this.encodeState(this.state.calculatorInfo);

    if (window.history.pushState) {
      const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${myNewUrlQuery}`;
      window.history.pushState({ path:newurl },'',newurl);
    }
  };

  sortDates = (a, b) => {
    if (moment(a.date).isBefore(b.date) === true) {
      return -1;
    } else if(moment(a.date).isBefore(b.date) === false) {
      return 1;
    } else {
      return 0;
    }
  };

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
      newExclusionReason: ''
    });
  };

  calculateDate = ({target}) => {
    const calculatedDate = moment()
      .addWorkdays(target.value, this.getExcludedDates())
      .format('MM-DD-YYYY');

    this.setState({
      result: calculatedDate,
      resultDays: target.value,
      numberOfDays: target.value,
    });
  };

  setNumberOfDays = ({target}) => {
    this.setState({ numberOfDays: target.value });
  };

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
  };

  toggleEditing = () => {
    this.setState({ isEditing: !this.state.isEditing });
  }

  handleTitleChange = ({ target }) => {
    const { calculatorInfo } = this.state;
    this.setState({
      calculatorInfo: {
        title: target.value,
        data: calculatorInfo.data,
      }
    });
  }

  updateHoverDate = (date, isEntering) => {
    if (isEntering && this.state.hoverDate !== date) {
      this.setState({
        hoverDate: date
      });
    } else if (this.state.hoverDate === date) {
      this.setState({
        hoverDate: ''
      });
    }
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
            <Button
              onClick={this.addToUrl}
            >
              Save
            </Button>
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
                <ExcludedDate
                  key={item.date}
                  onMouseEnter={this.updateHoverDate.bind(this, item.date, true)}
                  onMouseLeave={this.updateHoverDate.bind(this, item.date, false)}>
                  <ExcludedData>{item.date}</ExcludedData>
                  <ExcludedData>{item.reason}</ExcludedData>
                  <ExcludedData><div
                    className={["trash animated", this.state.hoverDate === item.date ? "trash-show rotateIn" : ""].join(" ")}
                    onClick={() => this.removeExclusion(id)}>
                    <FontAwesome name="trash"/>
                  </div></ExcludedData>
                </ExcludedDate>
              ))
            )}
          </SidebarContent>
          </ScrollContainer>
        </Sidebar>
        <Main>
          <Title>
            { this.state.isEditing ?
              (
                <div>
                  <TitleInput
                    value={calculatorInfo.title}
                    onChange={this.handleTitleChange}
                  />
                  <Scrim onClick={this.toggleEditing} />
                </div>
              ) : (
                <div onClick={this.toggleEditing}>
                  { calculatorInfo && calculatorInfo.title}
                </div>
              )
            }
          </Title>
          <Content>
            <Control>
              <div>In</div>
              <div className="margin">
                <Input
                  type="number"
                  onChange={this.calculateDate}
                />
              </div>
              <div>working days it will be:</div>
            </Control>
            <Result>
              { this.state.result &&
                  <ResultContent>
                    <Date>
                      {moment(this.state.result, 'MM-DD-YYYY').format('dddd, MMMM Do YYYY')}
                    </Date>
                    <Date className="Date">{this.state.result}</Date>
                  </ResultContent>
              }
            </Result>
          </Content>
          <Content>
            <Control>
              Add a New Date to Exclude
            </Control>
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
              <Button
                onClick={this.addExclusionDate}
              >
                Add Exclusion Date
              </Button>
            </Control>
          </Content>
        </Main>
      </Page>
    );
  }
}

export default App;
