import axios from 'axios';
import { showAlert } from './alerts';

export const addNewPlayerInput = async () => {
  const newPlayerFormGroup = document.createElement('div');
  newPlayerFormGroup.classList.add('.form__group.ma-bt-md');

  const newPlayerFormLabel = document.createElement('label');
  newPlayerFormLabel.classList.add('form__label');
  newPlayerFormLabel.setAttribute('for', 'player');
  newPlayerFormLabel.textContent = 'Players';

  const newPlayerFormInput = document.createElement('input');
  newPlayerFormInput.classList.add('form__input');
  newPlayerFormInput.classList.add('player__input');
  newPlayerFormInput.setAttribute('placeholder', 'Player Name');

  newPlayerFormGroup.appendChild(newPlayerFormLabel);
  newPlayerFormGroup.appendChild(newPlayerFormInput);
  document.getElementById('add-players-form__group').appendChild(newPlayerFormGroup);
};

export const createNewGroup = async (groupName, pword, pwordConfirm, players) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/groups/',
      data: {
        group_name: groupName,
        pword,
        // pwordConfirm,
        players,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Group created successfully!');
      window.setTimeout(() => {
        location.assign('/group');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const addPlayerToGroup = async (playerName) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/groups/addPlayerToGroup/${playerName}`,
      // data: {
      //   group_name: groupName,
      //   pword,
      //   // pwordConfirm,
      //   players,
      // },
      data: {},
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Player added successfully!');
      window.setTimeout(() => {
        location.assign('/group');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
