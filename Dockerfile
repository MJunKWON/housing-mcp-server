# 빌드 스테이지
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치 (devDependencies 포함)
RUN npm install

# TypeScript 컴파일러 설치
RUN npm install -g typescript

# 소스 코드 복사
COPY . .

# TypeScript 컴파일
RUN npm run build

# 프로덕션 스테이지
FROM node:18-alpine

WORKDIR /app

# 프로덕션 의존성만 설치
COPY package*.json ./
RUN npm install --omit=dev

# 빌드된 파일 복사
COPY --from=builder /app/dist ./dist

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=3000

# 포트 노출
EXPOSE 3000

# 서버 실행
CMD ["node", "dist/index.js"]