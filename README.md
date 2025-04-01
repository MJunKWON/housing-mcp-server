# Housing MCP Server

주택 관련 공공 API를 통합 관리하는 MCP 서버

## 환경 변수

```env
PORT=3000
PUBLIC_HOUSING_API_KEY=your_key
APARTMENT_LIST_API_KEY=your_key
APARTMENT_INFO_API_KEY=your_key
PUBLIC_HOUSING_API_ENDPOINT=http://apis.data.go.kr/B552555/lhLeaseInfo1
APARTMENT_LIST_API_ENDPOINT=http://apis.data.go.kr/1613000/AptListService3
APARTMENT_INFO_API_ENDPOINT=http://apis.data.go.kr/1613000/AptBasisInfoServiceV3
```

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