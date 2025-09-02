import express from 'express';

import controllers from '../controllers/UserController';

const UserRoutes = express.Router();

UserRoutes.post('/', controllers.createUser);
UserRoutes.patch('/:id', controllers.updateUser);
UserRoutes.delete('/hardDelete/:id', controllers.hardDeleteUser);
UserRoutes.patch('/softDelete/:id', controllers.softDeleteUser);
UserRoutes.get('/:id', controllers.getUserById);
UserRoutes.get('/', controllers.getAllUsers);

export default UserRoutes;