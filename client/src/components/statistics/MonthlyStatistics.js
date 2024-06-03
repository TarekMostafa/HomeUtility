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
import CurrenciesDropDown from '../currencies/CurrenciesDropDown';
import EditReportModal from './EditReportModal';
import AddNewReportModal from './AddNewReportModal';
import DeleteReportModal from './DeleteReportModal';

const initialState = {
  reportId: '',
  postingDateFrom: '',
  postingDateTo: '',
  currency: '',
  message: '',
  isLoading: false,
}

class MonthlyStatistics extends Component {
  state = {
    reports: [],
    stat: [],
    modalEditShow: false,
    modalAddShow: false,
    modalDeleteShow: false,
    ...initialState,
  }

  constructor(props) {
    super(props);
    this.state.postingDateTo = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString();
    let fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 2);
    fromDate.setDate(1);
    this.state.postingDateFrom = new Date(fromDate.toString().split('GMT')[0]+' UTC').toISOString();
  }

  componentDidMount() {
    this.loadReports();
  }
  
  loadReports = () => {
    ReportRequest.getReportsForDropDown()
    .then( (reports) => {
      this.setState({
        reports,
        reportId: reports.find(report => report.reportId+'' === this.state.reportId)? 
          this.state.reportId: ''
      })
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading reports list'});
    });
  }

  render() {
    return (
      <React.Fragment>
        <FormContainer title="Monthly Statistics" toolbar={
          <Button variant="info" size="sm" onClick={this.handleAddNewReport}>Create New Report</Button>
        }>
          <Form>
            <Row>
              <Col xs={3}>
                <Form.Control as="select" size="sm" name="reportId" onChange={this.handleChange}
                  value={this.state.reportId}>
                  <option value=''>Reports</option>
                  {this.getReportsList()}
                </Form.Control>
              </Col>
              <Col xs={2}>
                <Form.Control as="select" size="sm" name="currency" onChange={this.handleChange}
                  value={this.state.currency}>
                  <option value=''>Currencies</option>
                  <CurrenciesDropDown />
                </Form.Control>
              </Col>
              <Col xs={2}>
                <DatePickerInput value={this.state.postingDateFrom} small
                onChange={this.handlePostingDateFromChange} placeholder="Posting Date From" readOnly/>
              </Col>
              <Col xs={2}>
                <DatePickerInput value={this.state.postingDateTo} small
                onChange={this.handlePostingDateToChange} placeholder="Posting Date To" readOnly/>
              </Col>
              <Col xs={2}>
                <Button variant="primary" onClick={this.handleClick}>
                {
                  this.state.isLoading?
                  <Spinner as="span" animation="border" size="sm" role="status"
                  aria-hidden="true"/> : 'Run'
                }
                </Button>
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                {
                  this.state.reportId &&
                  <React.Fragment>
                  <Button variant="link" size="sm"
                    onClick={this.handleEditReport}>Edit</Button>
                  <Button variant="link" size="sm"
                    onClick={this.handleDeleteReport}>Delete</Button>
                  </React.Fragment>
                }
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
                <Col key={index} style={{ marginTop: 10}} xs={4}>
                  <MonthlyDetails data={data} decimalPlace={this.props.appSettings.currency.currencyDecimalPlace}/>
                </Col>
              )
            })
          }
          </Row>
        </FormContainer>
        { 
          this.state.modalEditShow && this.state.reportId &&
          <EditReportModal show={this.state.modalEditShow} onHide={this.handleHide}
          reportId={this.state.reportId} onSave={this.loadReports}/>
        }
        {
          this.state.modalAddShow && 
          <AddNewReportModal show={this.state.modalAddShow} onHide={this.handleHide}
          onCreate={this.loadReports}/>
        }
        {
          this.state.modalDeleteShow && this.state.reportId &&
          <DeleteReportModal show={this.state.modalDeleteShow} onHide={this.handleHide}
          reportId={this.state.reportId} onDelete={this.loadReports}/>
        }
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

  handleAddNewReport = () => {
    this.setState({
      modalAddShow: true
    });
  }

  handleEditReport = () => {
    if(this.state.reportId) {
      this.setState({
        modalEditShow: true
      });
    }
  }

  handleDeleteReport = () => {
    if(this.state.reportId) {
      this.setState({
        modalDeleteShow: true
      });
    }
  }

  handleHide = () => {
    this.setState({
      modalEditShow: false,
      modalAddShow: false,
      modalDeleteShow: false,
    });
  }

  handleClick = () => {
    if(!this.state.reportId) {
      this.setState({message: 'Invalid report, should not be empty'});
      return;
    } else if(!this.state.currency) {
      this.setState({message: 'Invalid currency, should not be empty'});
      return;
    } else if(!this.state.postingDateFrom) {
      this.setState({message: 'Invalid posting date from, should not be empty'});
      return;
    } else if(!this.state.postingDateTo) {
      this.setState({message: 'Invalid posting date to, should not be empty'});
      return;
    } else if (this.state.postingDateFrom > this.state.postingDateTo) {
      this.setState({message: 'Posting date from must be less than or equal to Posting date to'});
      return;
    } else {
      this.setState({
        message: '',
        isLoading: true,
      });
    }
    // Get Monthly Statistics
    TransactionRequest.getMonthlyStatistics(this.state.postingDateFrom,
      this.state.postingDateTo, this.state.reportId, this.state.currency)
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
