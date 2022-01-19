import bcrypt from 'bcrypt';

const { SALT_ROUNDS } = process.env;

const hashPassword = async (password: string) => (
  bcrypt.hash(password, Number(SALT_ROUNDS) ?? 15)
);

const comparePasswords = async (plainTextPassword: string, hashedPassword: string) => (
  bcrypt.compare(plainTextPassword, hashedPassword)
);

export {
  comparePasswords,
  hashPassword,
  SALT_ROUNDS,
};