import express from 'express';
import dotenv from 'dotenv';
import { getPublicHousingList } from './tools/publicHousingTool';
import { getAptList } from './tools/aptListTool';
import { getAptInfo } from './tools/aptInfoTool';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// 공공임대주택 정보 조회
app.post('/api/public-housing', async (req, res) => {
  try {
    const result = await getPublicHousingList(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 아파트 단지 목록 조회
app.post('/api/apt/list', async (req, res) => {
  try {
    const result = await getAptList(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 아파트 단지 상세정보 조회
app.post('/api/apt/info', async (req, res) => {
  try {
    const result = await getAptInfo(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Base URLs:');
  console.log(`Public Housing API: ${process.env.PUBLIC_HOUSING_API_BASE_URL}`);
  console.log(`Apt List API: ${process.env.APT_LIST_API_BASE_URL}`);
  console.log('API Keys:');
  console.log(`Public Housing: ${process.env.PUBLIC_HOUSING_API_KEY}`);
  console.log(`Apt List: ${process.env.APT_LIST_API_KEY}`);
});