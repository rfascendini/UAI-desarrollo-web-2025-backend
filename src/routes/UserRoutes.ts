import express from 'express';

import controllers from '../controllers/userController';

const UserRoutes = express.Router();

UserRoutes.post('/', controllers.createUser);
UserRoutes.patch('/:id', controllers.updateUser);
UserRoutes.delete('/hard/:id', controllers.hardDeleteUser);
UserRoutes.patch('/soft/:id', controllers.softDeleteUser);
UserRoutes.get('/:id', controllers.getUserById);
UserRoutes.get('/', controllers.getAllUsers);

export default UserRoutes;