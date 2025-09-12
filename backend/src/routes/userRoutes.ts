import { Router } from 'express';
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../controllers/userController.js';
import { validateRequest } from '../middleware/validation.js';
import { 
  createUserSchema, 
  updateUserSchema, 
  getUserParamsSchema, 
  getUsersQuerySchema 
} from '../schemas/userSchemas.js';

const router = Router();

router.get('/', 
  validateRequest({ query: getUsersQuerySchema }), 
  getUsers
);
router.get('/:id', 
  validateRequest({ params: getUserParamsSchema }), 
  getUserById
);
router.post('/', 
  validateRequest({ body: createUserSchema }), 
  createUser
);
router.put('/:id', 
  validateRequest({ 
    params: getUserParamsSchema, 
    body: updateUserSchema 
  }), 
  updateUser
);
router.delete('/:id', 
  validateRequest({ params: getUserParamsSchema }), 
  deleteUser
);

export default router;
