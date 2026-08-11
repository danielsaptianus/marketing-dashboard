import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  let publicKey: string | undefined;
  if (process.env.JWT_PUBLIC_KEY_BASE64) {
    try {
      publicKey = Buffer.from(process.env.JWT_PUBLIC_KEY_BASE64, 'base64').toString('utf-8');
    } catch {
      publicKey = process.env.JWT_PUBLIC_KEY_BASE64;
    }
  }

  return {
    secret: process.env.JWT_SECRET,
    publicKey,
    expiresIn: process.env.JWT_EXPIRATION || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d',
  };
});
