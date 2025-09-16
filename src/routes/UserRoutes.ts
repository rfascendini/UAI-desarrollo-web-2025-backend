import express from 'express';

import controllers from '../controllers/UserController';
import validationMiddleware from '../middleware/ValidatorMiddleware';
import { createUserValidationScheme } from '../validators/userValidation';

const UserRoutes = express.Router();


// CRUD routes
UserRoutes.post('/', validationMiddleware(createUserValidationScheme) ,controllers.createUser);
UserRoutes.patch('/:id', controllers.updateUser);
UserRoutes.delete('/hard/:id', controllers.hardDeleteUser);
UserRoutes.patch('/soft/:id', controllers.softDeleteUser);
UserRoutes.get('/:id', controllers.getUserById);
UserRoutes.get('/', controllers.getAllUsers);


// AUTH routes
UserRoutes.post('/login', controllers.loginUser);
UserRoutes.post('/logout', controllers.logoutUser);
UserRoutes.post('/register', controllers.registerUser);



export default UserRoutes;