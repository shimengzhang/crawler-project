import axios from './index';

function login(){
  return axios.post('/login');
}

export default {
  login
}