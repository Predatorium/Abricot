import dotenv from 'dotenv';

dotenv.config({
  path: process.env.REACT_ENV === 'production' ? './.env.production' : './.env.development',
});

const config = {
  apiUrl: process.env.API_URL,
  useMocks: process.env.USE_MOCKS === "true",
  email: process.env.FAKE_EMAIL,
  mdp: process.env.FAKE_MDP,
};

export default config;