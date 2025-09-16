import express from 'express';

import controllers from '../controllers/userController';
import validationMiddleware from '../middleware/ValidatorMiddleware';
import { createUserValidationScheme } from '../validators/userValidation';

const UserRoutes = express.Router();

UserRoutes.post('/', validationMiddleware(createUserValidationScheme) ,controllers.createUser);
UserRoutes.patch('/:id', controllers.updateUser);
UserRoutes.delete('/hard/:id', controllers.hardDeleteUser);
UserRoutes.patch('/soft/:id', controllers.softDeleteUser);
UserRoutes.get('/:id', controllers.getUserById);
UserRoutes.get('/', controllers.getAllUsers);

export default UserRoutes;