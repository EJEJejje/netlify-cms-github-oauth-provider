const simpleOauthModule = require('simple-oauth2')
const authMiddleWareInit = require('./auth.js')
const callbackMiddleWareInit = require('./callback')
const oauthProvider = process.env.OAUTH_PROVIDER || 'github'
const loginAuthTarget = process.env.AUTH_TARGET || '_self'

// ✅ ORIGINS 직접 지정 (정규식 및 검증 제거)
process.env.ORIGINS = process.env.ORIGINS || "https://ejejejje.github.io,https://ejejejje.github.io/ejfactory.github.io";

// ✅ 불필요한 검증 제거
const REQUIRED_ORIGIN_PATTERN = /.*/;


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
}

const oauth2 = new simpleOauthModule.AuthorizationCode(config)

function indexMiddleWare (req, res) {
  res.send(`Hello<br>
    <a href="/auth" target="${loginAuthTarget}">
      Log in with ${oauthProvider.toUpperCase()}
    </a>`)
}

module.exports = {
  auth: authMiddleWareInit(oauth2),
  callback: callbackMiddleWareInit(oauth2, oauthProvider),
  success: (req, res) => { res.send('') },
  index: indexMiddleWare
}
