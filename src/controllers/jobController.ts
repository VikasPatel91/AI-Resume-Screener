import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readJson, writeJson } from '../utils/fileutils';
import { Job } from '../models/jobModel';

export const createJob = (req: Request, res: Response) => {
  const { title, description } = req.body;

  const jobs = readJson<Job>('jobs.json');

  const isDuplicate = jobs.some(job => job.title.toLowerCase() === title.toLowerCase());

  if (isDuplicate) {
    return res.status(400).render('jobForm', {
      error: 'A job with this title already exists!',
      oldInput: { title, description }
    });
  }

  const newJob: Job = {
    id: uuidv4(),
    title,
    description
  };

  jobs.push(newJob);
  writeJson('jobs.json', jobs);

  res.render('jobSuccess', {
    job: newJob
  });
};


export const getJob = (req: Request, res: Response) => {
  const jobs = readJson<Job>('jobs.json');
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
};

export const AllJob = (req: Request, res: Response) => {
  const jobs = readJson<Job>('jobs.json');
  res.render('allJobs', { jobs });
};

export const renderJobForm = (req: Request, res: Response) => {
  res.render('jobForm');
};

export const deleteJob = (req: Request, res: Response) => {
  const { id } = req.params;
  let jobs = readJson<Job>('jobs.json');
  jobs = jobs.filter(job => job.id !== id);
  writeJson('jobs.json', jobs);
  res.redirect('/all-jobs');
};