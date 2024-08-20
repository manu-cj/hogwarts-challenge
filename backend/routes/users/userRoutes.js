import getUsers from './getUsers.js';
import addUser from './addUser.js';
import deleteUser from './deleteUser.js';
import updateUser from './updateUser.js';

export default function (app) {
    getUsers(app);
    addUser(app);
    deleteUser(app);
    updateUser(app);
}
