import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import store from './store/store';

import UserRequest from './axios/UserRequest';
import loadUser from './utilities/loadUser';

if(localStorage.hasOwnProperty("user")){
  const user = JSON.parse(localStorage.getItem("user"));
  UserRequest.tokenauthentication(user.userToken)
  .then( (response) => {
    loadUser(response.data);
  })
  .catch( (err) => {
    localStorage.removeItem("user");
  })
}

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
