import React, {useState, useEffect} from 'react';
import { Tabs, Tab, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';

import FormContainer from '../common/FormContainer';
import HomeDetails from './HomeDetails';
import NoData from '../common/NoData';

import HomeRequest from '../../axios/HomeRequest';

function Home(props) {

  const [data, setData] = useState({});
  const [key, setKey] = useState('home');

  const loadTotals = () => 
    HomeRequest.getTotals()
    .then(totals => setData(totals))
    .catch( err => console.log(err));

  useEffect(()=>{
    if(props.user) loadTotals();
  },[props.user])

  return (
    <React.Fragment>
      {
        props.user &&
        <FormContainer title="Profile Summary">
        <Tabs id="controlled-tab" activeKey={key} onSelect={(k) => setKey(k)}>
          <Tab eventKey="home" title="Home">
            <br />
            {
              <Alert variant="dark" className="text-center">
                <h5>Home Utility App</h5>
              </Alert>
            }
          </Tab>
          <Tab eventKey="profile" title="Profile">
            <br />
            {
              (data && data.profile) ?
              <HomeDetails sum={data.profile.sum} sumCurrency={data.profile.sumCurrency}/> :
              <NoData />
            }
          </Tab>
          <Tab eventKey="accounts" title="Accounts">
            <br />
            {
              (data && data.accounts) ?
              <HomeDetails data={data.accounts} sum={data.accounts.sum} 
                sumCurrency={data.accounts.sumCurrency}/> :
              <NoData />
            }
          </Tab>
          <Tab eventKey="deposits" title="Deposits">
            <br />
            {
              (data && data.deposits) ?
              <HomeDetails data={data.deposits} sum={data.deposits.sum} 
                sumCurrency={data.deposits.sumCurrency}/> :
              <NoData />  
            }
          </Tab>
          <Tab eventKey="cards" title="Cards">
            <br />
            {
              (data && data.cards) ?
              <HomeDetails data={data.cards} sum={data.cards.sum} 
                sumCurrency={data.cards.sumCurrency}/> :
              <NoData />
            }
          </Tab>
          <Tab eventKey="debts" title="Debts">
            <br />
            {
              (data && data.debtors) ?
              <HomeDetails data={data.debtors} sum={data.debtors.sum} 
                sumCurrency={data.debtors.sumCurrency}/> :
              <NoData />
            }
          </Tab>
        </Tabs>
        </FormContainer>
      }
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
}

export default connect(mapStateToProps)(Home);
