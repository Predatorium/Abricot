// API_URL n'a plus besoin du préfixe NEXT_PUBLIC_ : client.js ne tourne
// plus que côté serveur (Server Actions / Server Components).
const config = {
  apiUrl: process.env.API_URL,
  useMocks: process.env.USE_MOCKS === "true",
  email: process.env.FAKE_EMAIL,
  mdp: process.env.FAKE_MDP,
};

export default config;
