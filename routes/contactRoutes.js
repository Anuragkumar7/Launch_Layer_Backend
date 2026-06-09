import { Router } from 'express';
import { submitContact } from '../controllers/contactController.js';
import { validateContact } from '../middleware/validateContact.js';

const router = Router();

router.post('/', validateContact, submitContact);

export default router;
