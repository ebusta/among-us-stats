/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const createRadioButtonOption = (playerID, radioButtonType, radioButtonData) => {
  const newRadioButtonOption = document.createElement('input');
  newRadioButtonOption.classList.add('form-check-input');
  newRadioButtonOption.setAttribute('type', 'radio');
  newRadioButtonOption.setAttribute('name', `${radioButtonType}Radio${playerID}`);
  newRadioButtonOption.setAttribute('required', 'required');
  //newRadioButtonOption.setAttribute('id', `${radioButtonType}Radio${playerID}`);
  newRadioButtonOption.setAttribute('value', `${radioButtonData}`);
  return newRadioButtonOption;
};

const createRadioButtonLabel = (playerID, radioButtonType, radioButtonData) => {
  const newRadioButtonLabel = document.createElement('label');
  newRadioButtonLabel.classList.add('form-check-label');
  newRadioButtonLabel.setAttribute('for', `${radioButtonType}Radio${playerID}`);
  newRadioButtonLabel.textContent = radioButtonData;
  return newRadioButtonLabel;
};

const createCheckboxOption = (playerID, checkboxType, checkboxData) => {
  const newCheckboxOption = document.createElement('input');
  newCheckboxOption.classList.add('form-check-input');
  newCheckboxOption.setAttribute('type', 'checkbox');
  newCheckboxOption.setAttribute('value', `${checkboxData}`);
  newCheckboxOption.setAttribute('name', `${checkboxType}Checkbox${playerID}`);
  //newCheckboxOption.setAttribute('id', `${checkboxType}${checkboxData}checkbox${playerID}`);
  return newCheckboxOption;
};

const createCheckboxLabel = (playerID, checkboxType, checkboxData) => {
  const newCheckboxLabel = document.createElement('label');
  newCheckboxLabel.classList.add('form-check-label');
  newCheckboxLabel.setAttribute('for', `${checkboxType}Checkbox${playerID}`);
  newCheckboxLabel.textContent = checkboxData;
  return newCheckboxLabel;
};

export const loadPlayerOptions = async (playerID, players) => {
  const playerTypes = ['imp', 'crew'];
  const playerDeathTypes = ['ejection', 'murder', 'emergency', 'none'];

  // Main new section
  const newPlayerOptions = document.createElement('form');
  newPlayerOptions.classList.add('form');
  newPlayerOptions.setAttribute('id', playerID);

  //Create headers for each options section
  const newPlayerTypeHeader = document.createElement('h2');
  newPlayerTypeHeader.textContent = 'What type of player?';
  const newPlayerDeathTypeHeader = document.createElement('h2');
  newPlayerDeathTypeHeader.textContent = 'What type of death?';
  const newPlayerMurderHeader = document.createElement('h2');
  newPlayerMurderHeader.textContent = 'Who did you kill?';

  // Player Type Section

  newPlayerOptions.appendChild(newPlayerTypeHeader);
  playerTypes.forEach((el) => {
    const newPlayerType = document.createElement('div');
    newPlayerType.classList.add('form-check-inline');

    const playerTypeRadioButton = createRadioButtonOption(playerID, 'playerType', el);
    const playerTypeRadioButtonLabel = createRadioButtonLabel(playerID, 'playerType', el);
    newPlayerType.appendChild(playerTypeRadioButton);
    newPlayerType.appendChild(playerTypeRadioButtonLabel);

    newPlayerOptions.appendChild(newPlayerType);
  });

  // Player Death Type Section

  newPlayerOptions.appendChild(newPlayerDeathTypeHeader);
  playerDeathTypes.forEach((el) => {
    const newPlayerDeathType = document.createElement('div');
    newPlayerDeathType.classList.add('form-check-inline');

    const playerTypeRadioButton = createRadioButtonOption(playerID, 'playerDeathType', el);
    const playerTypeRadioButtonLabel = createRadioButtonLabel(playerID, 'playerDeathType', el);
    newPlayerDeathType.appendChild(playerTypeRadioButton);
    newPlayerDeathType.appendChild(playerTypeRadioButtonLabel);

    newPlayerOptions.appendChild(newPlayerDeathType);
  });

  // Murder section

  newPlayerOptions.appendChild(newPlayerMurderHeader);
  players.forEach((el) => {
    if (el.player_id !== playerID) {
      const newMurderOptions = document.createElement('div');
      newMurderOptions.classList.add('form-check');

      const murderRadioButton = createCheckboxOption(playerID, 'playerMurder', el.player_id);
      const murderRadioButtonLabel = createCheckboxLabel(playerID, 'playerMurder', el.player_name);
      newMurderOptions.appendChild(murderRadioButton);
      newMurderOptions.appendChild(murderRadioButtonLabel);

      newPlayerOptions.appendChild(newMurderOptions);
    }
  });

  document.getElementById(`player${playerID}`).appendChild(newPlayerOptions);
};

export const removePlayerOptions = async (playerID) => {
  const toRemove = document.getElementById(playerID);
  toRemove.remove();
};

export const getAllPlayers = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/groups/players',
    });
    return res.data.data;
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const submitGame = async (map, whoWon, howVictoryAchieved, players) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/stats/',
      data: {
        map_id: map,
        who_won: whoWon,
        how_victory_achieved: howVictoryAchieved,
        players,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Game submitted successfully!');
      window.setTimeout(() => {
        location.assign('/group');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
