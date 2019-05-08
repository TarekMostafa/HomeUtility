import axios from 'axios';

class Interceptor {
  constructor() {
    this.myInterceptor = null
  }

  setInterceptor(userToken) {
    this.myInterceptor = axios.interceptors.request.use(function (config) {
      config.headers.authorization = userToken;
      return config;
    });
  }

  removeInterceptor() {
    axios.interceptors.request.eject(this.myInterceptor)
  }
}

export default new Interceptor();
