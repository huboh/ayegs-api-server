import bcrypt from 'bcrypt';

const { SALT_ROUNDS } = process.env;

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, Number(SALT_ROUNDS) ?? 15);
};

export const comparePasswords = async (plainTextPassword: string, hashedPassword: string) => {
  return bcrypt.compare(plainTextPassword, hashedPassword);
};