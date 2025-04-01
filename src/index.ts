import express from 'express';
import cors from 'cors';
import { handleAptListRequest } from './tools/aptListTool';
import { handleAptInfoRequest } from './tools/aptInfoTool';
import { getPublicHousingList } from './tools/publicHousingTool';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/apt/list', handleAptListRequest);
app.post('/api/apt/info', handleAptInfoRequest);
app.post('/api/housing/list', getPublicHousingList);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});