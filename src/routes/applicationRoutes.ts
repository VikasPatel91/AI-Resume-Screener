import express from 'express';
import multer from 'multer';
import { submitApplication ,renderApplyForm,AllApplications,deleteApplication} from '../controllers/applicationController';
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/jobs/:id/apply', upload.single('resume'), submitApplication);
router.get('/job/:id/apply', renderApplyForm);
router.get('/all-applications', AllApplications);
router.delete('/applications/:id', deleteApplication);


export default router;
