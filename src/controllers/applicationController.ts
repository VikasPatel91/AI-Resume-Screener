import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';  
import { readJson, writeJson } from '../utils/fileutils';
import { extractTextFromPDF } from '../services/pdfServices';
import { callOpenRouterLLM } from '../services/llmServices';
import { Application } from '../models/applicationModel';
import { Job } from '../models/jobModel';
import path from 'path';
import fs from 'fs'; 

export const submitApplication = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const jobId = req.params.id;
  const jobs = readJson<Job>('jobs.json');
  const job = jobs.find(j => j.id === jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Resume is required' });
  if (!file.mimetype.includes('pdf')) {
    return res.status(400).json({ error: 'Only PDF files are allowed' });
  }

  const tempPath = path.join(__dirname, '../../uploads', file.filename);

  try {
    const resumeText = await extractTextFromPDF(tempPath);
    fs.unlinkSync(tempPath);

    const llmData = await callOpenRouterLLM(resumeText, job.description);

    const applications = readJson<Application>('applications.json');
    const newApp: Application = {
  id: uuidv4(),
  jobTitle: job.title, 
  name,
  email,
  extractedSkills: llmData.skills.join(', '),
  experienceSummary: llmData.experience,
  education: llmData.education,
  matchScore: llmData.score,
  analysis: llmData.analysis
};


    applications.push(newApp);
    writeJson('applications.json', applications);

    res.render('success', {
    score: llmData.score,
    analysis: llmData.analysis
  });
  } catch (err: any) {
    console.error('Error processing resume:', err);
    res.status(500).json({ error: 'Failed to process resume or call LLM' });
  }
};

export const renderApplyForm = (req: Request, res: Response) => {
  const id = req.params.id; 
  const jobs = readJson<Job>('jobs.json');
  const job = jobs.find(j => j.id === id);

  if (!job) {
    return res.status(404).send('Job not found');
  }

  res.render('applyForm', { job }); 
};

export const AllApplications = (req: Request, res: Response) => {
  const applications: Application[] = readJson<Application>('applications.json');
  res.render('allApplications', { applications });
};


export const deleteApplication = (req: Request, res: Response) => {
  const { id } = req.params;
  let applications = readJson<Application>('applications.json');
  applications = applications.filter(app => app.id !== id);
  writeJson('applications.json', applications);
  res.redirect('/all-applications');
};
