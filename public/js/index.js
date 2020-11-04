/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
// import { updateSettings } from './updateSettings';
import { addNewPlayerInput, createNewGroup, addPlayerToGroup } from './groupManagement';
import { loadPlayerOptions, removePlayerOptions, getAllPlayers, submitGame } from './gameManagement';

// HELPER FUNCTIONS
const handlePlayerOptions = async (checkboxes) => {
  const players = await getAllPlayers();
  checkboxes.forEach((el) => {
    el.addEventListener('change', (e) => {
      const checkbox = e.target;
      if (checkbox.checked) {
        loadPlayerOptions(checkbox.getAttribute('pid'), players);
      } else {
        removePlayerOptions(checkbox.getAttribute('pid'));
      }
    });
  });
};

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const newGroupForm = document.querySelector('.form--create-group');
const newPlayerForm = document.querySelector('.form--add-player-to-group');
const logoutButton = document.querySelector('.nav__el--logout');
// const userDataForm = document.querySelector('.form-user-data');
// const userPasswordForm = document.querySelector('.form-user-password');
const addPlayerButton = document.querySelector('.add-players-new-group');
const addPlayerOptionsCheckbox = document.querySelectorAll('.add-player-options');
const submitGameForm = document.querySelector('.form--create-game');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const groupName = document.getElementById('group').value;
    const pword = document.getElementById('password').value;
    login(groupName, pword);
  });
}

if (newGroupForm) {
  newGroupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const groupName = document.getElementById('group').value;
    const pword = document.getElementById('password').value;
    const pwordConfirm = document.getElementById('password-confirm').value;
    //const playersNode = document.querySelectorAll('player__input');
    const players = document.querySelectorAll('.player__input');
    const playersArray = Array.from(players);
    const playerNamesArray = playersArray.map((el) => {
      if (el.value !== '') return { player_name: el.value };
    });
    createNewGroup(groupName, pword, pwordConfirm, playerNamesArray);
  });
}

if (newPlayerForm) {
  newPlayerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const playerName = document.getElementById('player-name').value;
    if (playerName !== '') addPlayerToGroup(playerName);
  });
}

if (addPlayerOptionsCheckbox) {
  const checkboxes = Array.from(addPlayerOptionsCheckbox);
  handlePlayerOptions(checkboxes);
}

if (submitGameForm) {
  submitGameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const map = document.querySelector('input[name="mapRadios"]:checked').value;
    const whoWon = document.querySelector('input[name="winnerRadios"]:checked').value;
    const howVictoryAchieved = document.querySelector('input[name="victoryRadios"]:checked').value;
    const playerNodeList = document.querySelectorAll('input[name="playerCheckboxes"]:checked');
    let players = [];
    const playerIDs = Array.from(playerNodeList).map((el) => {
      return el.value;
    });
    playerIDs.forEach((el) => {
      const playerType = document.querySelector(`input[name="playerTypeRadio${el}"]:checked`).value;
      const deathType = document.querySelector(`input[name="playerDeathTypeRadio${el}"]:checked`).value;
      const isVictorious = whoWon === playerType ? true : false;
      const murderNodeList = document.querySelectorAll(`input[name="playerMurderCheckbox${el}"]:checked`);
      const playerMurders = Array.from(murderNodeList).map((el) => {
        return el.value;
      });
      const playerObj = {
        player_id: el,
        player_type: playerType,
        death_type: deathType,
        is_victorious: isVictorious,
        murders: playerMurders,
      };
      players.push(playerObj);
    });
    submitGame(map, whoWon, howVictoryAchieved, players);
  });
}

if (addPlayerButton) addPlayerButton.addEventListener('click', addNewPlayerInput);

if (logoutButton) logoutButton.addEventListener('click', logout);

//NOT CURRENTLY IMPLEMENTED
// if (userDataForm) {
//   userDataForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const email = document.getElementById('email').value;
//     const name = document.getElementById('name').value;
//     updateSettings({ name, email }, 'data');
//   });
// }

//NOT CURRENTLY IMPLEMENTED
// if (userPasswordForm) {
//   userPasswordForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     document.querySelector('.btn--save-password').textContent = 'Updating...';

//     const passwordCurrent = document.getElementById('password-current').value;
//     const password = document.getElementById('password').value;
//     const passwordConfirm = document.getElementById('password-confirm').value;
//     await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

//     document.querySelector('.btn--save-password').textContent = 'Save password';
//     document.getElementById('password-current').value = '';
//     document.getElementById('password').value = '';
//     document.getElementById('password-confirm').value = '';
//   });
// }
