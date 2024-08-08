import React, {useState, useEffect} from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { connect } from 'react-redux';

import FormContainer from '../common/FormContainer';
import HomeDetails from './HomeDetails';

import HomeRequest from '../../axios/HomeRequest';

function Home(props) {

  const [data, setData] = useState({});
  const [key, setKey] = useState('profile');

  const loadTotals = () => 
    HomeRequest.getTotals().then(totals => setData(totals));

  useEffect(()=>{
    if(props.user) loadTotals();
  },[props.user])

  return (
    <React.Fragment>
      {
        props.user &&
        <FormContainer title="Profile Summary">
        <Tabs id="controlled-tab" activeKey={key} onSelect={(k) => setKey(k)}>
          <Tab eventKey="profile" title="Profile">
            <br />
            {
              data.profile &&
              <HomeDetails sum={data.profile.sum} sumCurrency={data.profile.sumCurrency}/>
            }
          </Tab>
          <Tab eventKey="accounts" title="Accounts">
            <br />
            {
              data.accounts &&
              <HomeDetails data={data.accounts} sum={data.accounts.sum} 
                sumCurrency={data.accounts.sumCurrency}/> 
            }
          </Tab>
          <Tab eventKey="deposits" title="Deposits">
            <br />
            {
              data.deposits &&
              <HomeDetails data={data.deposits} sum={data.deposits.sum} 
                sumCurrency={data.deposits.sumCurrency}/>
            }
          </Tab>
          <Tab eventKey="cards" title="Cards">
            <br />
            {
              data.cards &&
              <HomeDetails data={data.cards} sum={data.cards.sum} 
                sumCurrency={data.cards.sumCurrency}/>
            }
          </Tab>
          <Tab eventKey="debts" title="Debts">
            <br />
            {
              data.debtors &&
              <HomeDetails data={data.debtors} sum={data.debtors.sum} 
                sumCurrency={data.debtors.sumCurrency}/>
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
