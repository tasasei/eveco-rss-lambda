import { Router } from 'express';
import { route as evecoRoute } from './eveco';
import { route as startggRoute } from './startgg';

export const router = Router()
router.get('/', (req, res) => {
  res.sendStatus(200)
})
router.use('/eveco', evecoRoute)
router.use('/startgg', startggRoute)
