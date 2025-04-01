import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { handleAptListRequest } from './tools/aptListTool';
import { handleAptInfoRequest } from './tools/aptInfoTool';
import { getPublicHousingList } from './tools/publicHousingTool';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// MCP 서버 설정
const server = new Server(
  {
    name: "housing-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 사용 가능한 도구 목록 정의
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get-apt-list",
        description: "아파트 단지 목록을 조회합니다",
        inputSchema: {
          type: "object",
          properties: {
            pageNo: {
              type: "number",
              description: "페이지 번호",
            },
            numOfRows: {
              type: "number",
              description: "한 페이지 결과 수",
            },
          },
          required: ["pageNo", "numOfRows"],
        },
      },
      {
        name: "get-apt-info",
        description: "아파트 단지 상세 정보를 조회합니다",
        inputSchema: {
          type: "object",
          properties: {
            kaptCode: {
              type: "string",
              description: "아파트 단지 코드",
            },
          },
          required: ["kaptCode"],
        },
      },
      {
        name: "get-public-housing",
        description: "공공임대주택 정보를 조회합니다",
        inputSchema: {
          type: "object",
          properties: {
            pageNo: {
              type: "number",
              description: "페이지 번호",
            },
            numOfRows: {
              type: "number",
              description: "한 페이지 결과 수",
            },
            sido: {
              type: "string",
              description: "시도명 (선택사항)",
            },
          },
          required: ["pageNo", "numOfRows"],
        },
      },
    ],
  };
});

// 도구 실행 처리
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    return {
      content: [
        {
          type: "text",
          text: "인자가 제공되지 않았습니다.",
        },
      ],
    };
  }

  try {
    switch (name) {
      case "get-apt-list":
        return await handleAptListRequest({
          type: args.type as "sido" | "sigungu" | "total" | "legaldong" | "roadname",
          pageNo: Number(args.pageNo),
          numOfRows: Number(args.numOfRows),
          sidoCode: args.sidoCode as string | undefined,
          sigunguCode: args.sigunguCode as string | undefined,
          bjdCode: args.bjdCode as string | undefined,
          roadCode: args.roadCode as string | undefined,
        });
      case "get-apt-info":
        return await handleAptInfoRequest({
          type: args.type as "basic" | "detail",
          kaptCode: args.kaptCode as string,
        });
      case "get-public-housing":
        return await getPublicHousingList({
          pageNo: Number(args.pageNo),
          numOfRows: Number(args.numOfRows),
          sido: args.sido as string | undefined,
        });
      default:
        throw new Error(`알 수 없는 도구: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `에러 발생: ${error instanceof Error ? error.message : "알 수 없는 에러"}`,
        },
      ],
    };
  }
});

// Express 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
});

// MCP 서버 시작
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Housing MCP Server가 stdio에서 실행 중입니다");
}

main().catch((error) => {
  console.error("main()에서 치명적인 오류 발생:", error);
  process.exit(1);
});