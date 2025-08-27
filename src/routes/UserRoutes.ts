import express from 'express';

import controllers from '../controllers/UserController';

const UserRoutes = express.Router();

UserRoutes.post('/', controllers.createUser);

export default UserRoutes;