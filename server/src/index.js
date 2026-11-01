import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import {z} from 'zod';
import {scoreApplication} from './risk.js';
const app = express(); app.use(helmet()); app.use(cors()); app.use(express.json({limit:'30kb'}));
const schema = z.object({applicant:z.string().trim().min(2).max(100),email:z.string().email(),annualIncome:z.coerce.number().positive().max(1e9),monthlyDebt:z.coerce.number().min(0).max(1e8),loanAmount:z.coerce.number().positive().max(1e8),termMonths:z.coerce.number().int().min(6).max(360),creditScore:z.coerce.number().int().min(300).max(850),employmentYears:z.coerce.number().min(0).max(70),purpose:z.enum(['Home improvement','Education','Debt consolidation','Personal','Business','Vehicle'])});
const seed = [
 ['CR-1042','Olivia Bennett','Home improvement',24000,24,775,78000,420,6,'Approved','2026-10-29'],
 ['CR-1041','James Rodriguez','Debt consolidation',48000,36,662,62000,910,3,'In review','2026-10-28'],
 ['CR-1040','Sophia Chen','Education',18000,24,728,95000,220,5,'Approved','2026-10-27'],
 ['CR-1039','Noah Williams','Business',85000,60,591,52000,1650,1,'Flagged','2026-10-26'],
 ['CR-1038','Emma Thompson','Vehicle',32000,48,705,86000,460,4,'In review','2026-10-25'],
 ['CR-1037','Liam Patel','Personal',12000,12,802,115000,150,8,'Approved','2026-10-24'],
].map(([id,applicant,purpose,loanAmount,termMonths,creditScore,annualIncome,monthlyDebt,employmentYears,status,date])=>{const data={id,applicant,email:'demo@example.com',purpose,loanAmount,termMonths,creditScore,annualIncome,monthlyDebt,employmentYears,status,date};return {...data,analysis:scoreApplication(data)}});
let applications = [...seed]; let sequence=1043;
app.get('/api/health',(_req,res)=>res.json({ok:true,mode:'demo'}));
app.get('/api/applications',(_req,res)=>res.json(applications));
app.get('/api/metrics',(_req,res)=>{const total=applications.length,approved=applications.filter(a=>a.status==='Approved').length,flagged=applications.filter(a=>a.status==='Flagged').length,pending=applications.filter(a=>a.status==='In review').length;res.json({total,approved,flagged,pending,approvalRate:total?Math.round(approved/total*100):0,averageRisk:total?Math.round(applications.reduce((s,a)=>s+a.analysis.risk,0)/total):0,volume:applications.reduce((s,a)=>s+a.loanAmount,0)});});
app.post('/api/analyze',async(req,res)=>{const parsed=schema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:'Invalid application',details:parsed.error.flatten()});res.json(scoreApplication(parsed.data));});
app.post('/api/applications',async(req,res)=>{const parsed=schema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:'Invalid application',details:parsed.error.flatten()});const data=parsed.data;const analysis=scoreApplication(data);const record={...data,id:`CR-${sequence++}`,date:new Date().toISOString().slice(0,10),status:'In review',analysis};applications.unshift(record);res.status(201).json(record);});
app.patch('/api/applications/:id/status',(req,res)=>{const status=z.enum(['In review','Approved','Declined','Flagged']).safeParse(req.body?.status);if(!status.success)return res.status(400).json({error:'Invalid status'});const record=applications.find(a=>a.id===req.params.id);if(!record)return res.status(404).json({error:'Not found'});record.status=status.data;res.json(record);});
app.listen(process.env.PORT||4000,()=>console.log('Credence API listening on http://localhost:'+(process.env.PORT||4000)));
