// Configuração da API baseada no ambiente
const getApiUrl = () => {
  // Em produção, usar a variável de ambiente do Vite
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Em desenvolvimento, usar localhost
  return 'http://localhost:4000';
};

export const API_URL = getApiUrl();

export default {
  API_URL,
  // Outras configurações podem ser adicionadas aqui
  TIMEOUT: 30000, // 30 segundos
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};
