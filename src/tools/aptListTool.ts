import { Server } from "@modelcontextprotocol/sdk/server";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types";
import axios from 'axios';

const server = new Server({
  name: "apt-list-tool",
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
      name: "get_apt_list",
      description: "법정동 코드로 아파트 목록을 조회합니다",
      inputSchema: {
        type: "object",
        properties: {
          bjdCode: { type: "string" }
        },
        required: ["bjdCode"]
      }
    }]
  };
});

// 도구 실행 처리
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_apt_list") {
    try {
      const { bjdCode } = request.params.arguments;
      const serviceKey = process.env.APARTMENT_LIST_API_KEY;
      const url = `${process.env.APARTMENT_LIST_API_ENDPOINT}/getAptList`;

      const response = await axios.get(url, {
        params: {
          serviceKey,
          bjdCode,
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
      console.error('아파트 목록 조회 중 오류:', error);
      throw new Error('아파트 목록을 가져오는데 실패했습니다.');
    }
  }
  throw new Error("도구를 찾을 수 없습니다");
});