const express = require('express');
const simpleOauthModule = require('simple-oauth2');
const authMiddleWareInit = require('./auth.js');
const callbackMiddleWareInit = require('./callback');

const oauthProvider = process.env.OAUTH_PROVIDER || 'github';
const loginAuthTarget = process.env.AUTH_TARGET || '_self';

// ✅ ORIGINS 기본값 (Render에서도 읽을 수 있게 보장)
process.env.ORIGINS = process.env.ORIGINS || "https://ejejejje.github.io,https://ejejejje.github.io/ejfactory.github.io";

// ✅ 간단한 유효성 패턴 (에러 방지용)
const REQUIRED_ORIGIN_PATTERN = /^https?:\/\/[^\s,]+(,[^\s,]+)*$/;
if (!REQUIRED_ORIGIN_PATTERN.test(process.env.ORIGINS)) {
  console.error('❌ Invalid ORIGINS format:', process.env.ORIGINS);
  process.exit(1);
}

// ✅ OAuth 설정
const config = {
  client: {
    id: process.env.OAUTH_CLIENT_ID,
    secret: process.env.OAUTH_CLIENT_SECRET
  },
  auth: {
    tokenHost: process.env.GIT_HOSTNAME || 'https://github.com',
    tokenPath: process.env.OAUTH_TOKEN_PATH || '/login/oauth/access_token',
    authorizePath: process.env.OAUTH_AUTHORIZE_PATH || '/login/oauth/authorize'
  }
};

const oauth2 = new simpleOauthModule.AuthorizationCode(config);

// ✅ Express 서버 초기화
const app = express();

// ✅ 라우터 구성
app.get('/', (req, res) => {
  res.send(`Hello<br>
    <a href="/auth" target="${loginAuthTarget}">
      Log in with ${oauthProvider.toUpperCase()}
    </a>`);
});

app.use('/auth', authMiddleWareInit(oauth2));
app.use('/callback', callbackMiddleWareInit(oauth2, oauthProvider));
app.get('/success', (req, res) => res.send('✅ Login success!'));

// ✅ Render 감시용 포트로 서버 실행
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
