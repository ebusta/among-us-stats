/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (groupName, pword) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/groups/login',
      data: {
        groupName,
        pword,
      },
    }); //

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/groups/logout',
    });

    if (res.data.status === 'success') location.assign('/');
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out. Please try again.');
  }
};
