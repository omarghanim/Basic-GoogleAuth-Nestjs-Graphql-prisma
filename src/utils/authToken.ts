import * as jwt from 'jsonwebtoken';

// Check the userType(needs to verify that the particular user has a type in the database)
export const createAccessToken = (userId:string, type:string) => {
  return jwt.sign(
    { userId , type },
    process.env.ACCESS_TOKEN,
    { expiresIn: '30m' },
  );
};

export const createRefreshToken = (userId, tokenVersion) => {
  return jwt.sign(
    { userId, tokenVersion: tokenVersion },
    process.env.REFRESH_TOKEN,
    { expiresIn: '7d' },
  );
};

export const sendRefereshToken = (res, token:string) => {
  if (process.env.NODE_ENV == 'prod') {
    // you can not use  sameSite: "None" without  secure: true  so if using different domain name between frontend and backend you need to install ssl
    return res.cookie('cookiesecret', token, {
      httpOnly: true,
      maxAge: 604800000, // 7 days (ms)
      signed: true,
      secure: true,
      sameSite: "None",
      path: '/refresh',
    });
  } else {    
    // you can not use  sameSite: "None" without  secure: true  so if using different domain name between frontend and backend you need to install ssl
    return res.cookie('cookiesecret', token, {
      httpOnly: true,
      maxAge: 604800000,
      path: '/refresh',
      sameSite: 'lax',
    });
  }
};

