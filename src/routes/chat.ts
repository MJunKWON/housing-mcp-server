import express from 'express';
import { Anthropic } from '@anthropic-ai/sdk';
import { z } from 'zod';

const router = express.Router();
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

const chatSchema = z.object({
  message: z.string(),
  conversationId: z.string().optional()
});

router.post('/chat', async (req, res) => {
  try {
    const { message, conversationId } = chatSchema.parse(req.body);
    
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: message
      }],
      system: "당신은 주택 정보 조회 서비스의 상담원입니다. MCP 서버를 통해 공공 주택 API에 접근할 수 있습니다."
    });

    const messageContent = response.content[0].type === 'text' 
      ? response.content[0].text 
      : '응답을 처리할 수 없습니다.';

    res.json({
      message: messageContent,
      conversationId: conversationId || Date.now().toString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다' 
    });
  }
});

export default router;