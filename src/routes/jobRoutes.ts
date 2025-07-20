import express from 'express';
import { createJob, getJob, renderJobForm, AllJob,deleteJob } from '../controllers/jobController';

const router = express.Router();

router.get('/jobs/new', renderJobForm);   
router.post('/jobs', createJob);      
router.get('/jobs/:id', getJob);       
router.get('/all-jobs', AllJob);       
router.delete('/jobs/:id', deleteJob);
export default router;
