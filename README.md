# Housing MCP Server

주택 관련 공공 API를 통합 관리하는 MCP 서버입니다.

## 기능

- 아파트 단지 정보 조회
- 아파트 상세 정보 조회
- 공공임대주택 정보 조회

## 기술 스택

- Node.js
- TypeScript
- Express
- MCP (Model Context Protocol)
- Claude API

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm start
```

## 환경 변수

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경변수를 설정하세요:

```env
PORT=3000
ANTHROPIC_API_KEY=your_claude_api_key
PUBLIC_DATA_API_KEY=your_public_data_api_key
```

## API 엔드포인트

- `POST /api/apt/list`: 아파트 단지 목록 조회
- `POST /api/apt/info`: 아파트 상세 정보 조회
- `POST /api/public-housing`: 공공임대주택 정보 조회
- `GET /health`: 서버 상태 확인

## Railway 배포

1. Railway 계정에 프로젝트를 연결합니다.
2. 환경 변수를 설정합니다.
3. 자동 배포가 시작됩니다.

## 라이선스

ISC