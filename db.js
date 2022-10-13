const axios = require('axios'); 
const jwt = require('jsonwebtoken'); 
const Sequelize = require('sequelize'); 
const { STRING, INTEGER } = Sequelize; 
const config = { logging: false }; 

if(process.env.LOGGING){ delete config.logging; } 

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_db', config); 

const User = conn.define('user', { username: STRING }); 

User.byToken = async(token)=> { 
 try { 
  const { id } = await jwt.verify(token, process.env.JWT); 
  const user = await User.findByPk(id);
  if(user){ return user; } throw 'noooo';
 } catch(ex){ 
  const error = Error('bad credentials'); 
  error.status = 401; throw error;
 } 
}; 

User.authenticate = async function(){
  throw Error('nooooo');
};

// documentation - https://docs.github.com/en/developers/apps/authorizing-oauth-apps 
// useful urls const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
// const GITHUB_USER_URL = 'https://api.github.com/user'; 
//the authenticate methods is passed a code which has been sent by github 

//consider modifying /github/callback route in app.js in order to test incrementally 
//(STEP 1) TODO - make axios post to GITHUB_TOKEN_URL with code, client_id, client_secret; 
//{ headers: { accept: 'application/json' }} for easier response handling */ 

//(STEP 2) TODO - use access_token from response to make get request to GITHUB_USER_URL 

//send header with Authorization and value 'token whatever_access_token_is'
///* headers: { Authorization: `token ${access_token}` } */ 

//(STEP 3) TODO - use the login value from github to identify user in app 
//login from github should map to username in application 
//if the user does not exist, create the user 
//return a JWT token which has an id property with the users id }; 

const syncAndSeed = async()=> {
 await conn.sync({ force: true }); 
}; 

module.exports = { syncAndSeed, models: { User } };
