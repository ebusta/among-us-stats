/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { addNewPlayerInput, createNewGroup } from './addGroup';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const newGroupForm = document.querySelector('.form--create-group');
const logoutButton = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const addPlayerButton = document.querySelector('.add-players');

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
      return { player_name: el.value };
    });
    createNewGroup(groupName, pword, pwordConfirm, playerNamesArray);
  });
}

if (addPlayerButton) addPlayerButton.addEventListener('click', addNewPlayerInput);

if (logoutButton) logoutButton.addEventListener('click', logout);

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    updateSettings({ name, email }, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
