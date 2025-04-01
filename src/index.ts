import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { handleAptListRequest } from './tools/aptListTool.js';
import { handleAptInfoRequest } from './tools/aptInfoTool.js';
import { getPublicHousingList } from './tools/publicHousingTool.js';

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json());

// 헬스체크 엔드포인트
app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: 'healthy' });
});

// API 엔드포인트 정의
app.post('/api/apt/list', async (req: express.Request, res: express.Response) => {
  try {
    const result = await handleAptListRequest(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error handling apt list request:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/apt/info', async (req: express.Request, res: express.Response) => {
  try {
    const result = await handleAptInfoRequest(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error handling apt info request:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 공공주택 API 엔드포인트
app.post('/api/public-housing', async (req: express.Request, res: express.Response) => {
  try {
    const result = await getPublicHousingList(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error in public housing API:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});