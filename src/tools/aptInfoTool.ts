import { Server } from "@modelcontextprotocol/sdk/server";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types";
import axios from 'axios';

const server = new Server({
  name: "apt-info-tool",
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
      name: "get_apt_info",
      description: "아파트 코드로 상세 정보를 조회합니다",
      inputSchema: {
        type: "object",
        properties: {
          type: { type: "string" },
          kaptCode: { type: "string" }
        },
        required: ["type", "kaptCode"]
      }
    }]
  };
});

// 도구 실행 처리
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_apt_info") {
    try {
      const { type, kaptCode } = request.params.arguments;
      const serviceKey = process.env.APARTMENT_INFO_API_KEY;
      const url = `${process.env.APARTMENT_INFO_API_ENDPOINT}/getAptBasisInfo`;

      const response = await axios.get(url, {
        params: {
          serviceKey,
          kaptCode,
          type
        }
      });

      return {
        content: [{
          type: "text",
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    } catch (error) {
      console.error('아파트 정보 조회 중 오류:', error);
      throw new Error('아파트 정보를 가져오는데 실패했습니다.');
    }
  }
  throw new Error("도구를 찾을 수 없습니다");
});