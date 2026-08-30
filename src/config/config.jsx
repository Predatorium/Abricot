// API_URL n'a plus besoin du préfixe NEXT_PUBLIC_ : client.js ne tourne
// plus que côté serveur (Server Actions / Server Components).
const config = {
  apiUrl: process.env.API_URL,
  env: process.env.REACT_ENV,
  apiIAKey: process.env.GEMINI_API_KEY,
};

export default config;
