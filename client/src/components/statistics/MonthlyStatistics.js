import React, { Component } from 'react';
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import { connect } from 'react-redux';

import MonthlyDetails from './MonthlyDetails';
import FormContainer from '../common/FormContainer';
import ReportRequest from '../../axios/ReportRequest';
import TransactionRequest from '../../axios/TransactionRequest';

const initialState = {
  reportId: '',
  postingDateFrom: '',
  postingDateTo: '',
  message: '',
  isLoading: false,
}

class MonthlyStatistics extends Component {
  state = {
    reports: [],
    stat: [],
    ...initialState,
  }

  componentDidMount() {
    ReportRequest.getReportsForDropDown()
    .then( (reports) => {
      this.setState({
        reports
      })
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading reports list'});
    })
  }

  render() {
    return (
      <React.Fragment>
        <FormContainer title="Monthly Statistics">
          <Form>
            <Row>
              <Col>
                <Form.Control as="select" size="sm" name="reportId" onChange={this.handleChange}
                  value={this.state.reportId}>
                  <option value=''>Reports</option>
                  {this.getReportsList()}
                </Form.Control>
              </Col>
              <Col>
                <DatePickerInput value={this.state.postingDateFrom} small
                onChange={this.handlePostingDateFromChange} placeholder="Posting Date From" readOnly/>
              </Col>
              <Col>
                <DatePickerInput value={this.state.postingDateTo} small
                onChange={this.handlePostingDateToChange} placeholder="Posting Date To" readOnly/>
              </Col>
              <Col>
                <Button variant="primary" onClick={this.handleClick}>
                {
                  this.state.isLoading?
                  <Spinner as="span" animation="border" size="sm" role="status"
                  aria-hidden="true"/> : 'Search'
                }
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Text className='text-danger'>{this.state.message}</Form.Text>
              </Col>
            </Row>
          </Form>
        </FormContainer>
        <FormContainer>
          <Row>
          {
            this.state.stat.map( (data, index) => {
              return (
                <Col>
                  <MonthlyDetails key={index} data={data} />
                </Col>
              )
            })
          }
          </Row>
        </FormContainer>
      </React.Fragment>
    )
  }//end of render

  getReportsList = () => {
    return this.state.reports.map( (report) => {
      return (
        <option key={report.reportId} value={report.reportId}>{report.reportName}</option>
      )
    });
  }

  handleClick = () => {
    if(!this.state.reportId) {
      this.setState({message: 'Invalid report, should not be empty'});
      return;
    } else if(!this.state.postingDateFrom) {
      this.setState({message: 'Invalid posting date from, should not be empty'});
      return;
    } else if(!this.state.postingDateTo) {
      this.setState({message: 'Invalid posting date to, should not be empty'});
      return;
    } else {
      this.setState({
        message: '',
        isLoading: true,
      });
    }
    // Get Monthly Statistics
    // Add single transaction
    TransactionRequest.getMonthlyStatistics(this.state.postingDateFrom,
      this.state.postingDateTo, this.state.reportId)
    .then( (result) => {
      this.setState({
        stat: result,
        isLoading: false
      });
    })
    .catch( err => {
      this.setState({
        message: err.response.data,
        isLoading: false,
      })
    })
  }

  handlePostingDateFromChange = (jsDate, date) => {
    this.setState({
      postingDateFrom: date
    });
  }

  handlePostingDateToChange = (jsDate, date) => {
    this.setState({
      postingDateTo: date
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    });
  }

}

const mapStateToProps = (state) => {
	return {
    appSettings: state.lookups.appSettings,
	}
}

export default connect(mapStateToProps)(MonthlyStatistics);
