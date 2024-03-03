import { boot } from 'quasar/wrappers'
import axios from 'axios';

export default boot((/* { app, router, ... } */) => {
  // Use this configuration to send the credential cookies
  axios.defaults.withCredentials = true
})
