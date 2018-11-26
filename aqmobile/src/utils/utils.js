import 'whatwg-fetch'
import urlencode from 'urlencode'
import store from '../vuex/store'

export const wisLoading = {
  show: () => {
    store.commit('sysconfig/SET_LOADING_STATE', true);
  },
  close: () => {
    store.commit('sysconfig/SET_LOADING_STATE', false);
  }
};

export const wisFetch = (url, params = {}) => {
  wisLoading.show();
  return fetch(window.host + '/api/' + url, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: urlencode.stringify(params),
    timeout: 30 * 1000
  })
    .then(res => res.json())
    .then(res => {
      wisLoading.close();
      return res;
    }).catch(e => {
      wisLoading.close();
    })
};

export const formatTime = (seconds) => {
  let r = [];
  if (parseInt(seconds / 60 / 60)) {
    r = [
      parseInt(seconds / 60 / 60),
      parseInt(seconds / 60 % 60),
      parseInt(seconds % 60)
    ]
  } else {
    r = [
      parseInt(seconds / 60 % 60),
      parseInt(seconds % 60)
    ]
  }
  
  return r.join(":").replace(/\b(\d)\b/g, "0$1");
}
