import { Server } from "@modelcontextprotocol/sdk/server";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types";
import axios from 'axios';

const server = new Server({
  name: "public-housing-tool",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

// 도구 정의
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [{
      name: "get_public_housing_list",
      description: "지역코드로 공공임대주택 목록을 조회합니다",
      inputSchema: {
        type: "object",
        properties: {
          regionCode: { type: "string" }
        },
        required: ["regionCode"]
      }
    }]
  };
});

// 도구 실행 처리
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_public_housing_list") {
    try {
      const { regionCode } = request.params.arguments;
      const serviceKey = process.env.PUBLIC_HOUSING_API_KEY;
      const url = process.env.PUBLIC_HOUSING_API_ENDPOINT;

      const response = await axios.get(url, {
        params: {
          serviceKey,
          regionCode,
          numOfRows: 100,
          pageNo: 1
        }
      });

      return {
        content: [{
          type: "text",
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    } catch (error) {
      console.error('공공임대주택 목록 조회 중 오류:', error);
      throw new Error('공공임대주택 목록을 가져오는데 실패했습니다.');
    }
  }
  throw new Error("도구를 찾을 수 없습니다");
});