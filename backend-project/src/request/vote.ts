import axios from './index';

function voteAdd(){
  return axios.post('/insertVote', {
    xxx: 'xxx'
  });
}

export default {
  voteAdd
}