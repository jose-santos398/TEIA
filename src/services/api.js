// services/api.js
// Servico centralizado para comunicacao com o backend Spring Boot

const API_BASE_URL = 'http://localhost:8080';

/**
 * Funcao auxiliar para fazer requisicoes HTTP
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return { success: response.ok, data, status: response.status };
    }

    return {
      success: response.ok,
      data: null,
      status: response.status,
      message: response.statusText,
    };
  } catch (error) {
    console.error('Erro na requisicao:', error);
    throw new Error('Erro de conexao com o servidor. Verifique se o backend esta rodando.');
  }
};

export const candidatoAPI = {
  getAll: async () => {
    return await fetchAPI('/candidato', {
      method: 'GET',
    });
  },

  cadastrar: async (candidatoData) => {
    return await fetchAPI('/candidato', {
      method: 'POST',
      body: JSON.stringify(candidatoData),
    });
  },

  login: async (credentials) => {
    return await fetchAPI('/candidato/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  uploadCurriculo: async (candidatoId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/candidato/${candidatoId}/curriculo`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return { success: response.ok, data, status: response.status };
    } catch (error) {
      console.error('Erro no upload de curriculo:', error);
      throw new Error('Erro de conexao com o servidor. Verifique se o backend esta rodando.');
    }
  },

  analisarCurriculo: async (candidatoId) => {
    return await fetchAPI(`/candidato/${candidatoId}/curriculo/analise`, {
      method: 'POST',
    });
  },

  removerCurriculo: async (candidatoId) => {
    return await fetchAPI(`/candidato/${candidatoId}/curriculo`, {
      method: 'DELETE',
    });
  },

  baixarCurriculoBlob: async (candidatoId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/candidato/${candidatoId}/curriculo`, {
        method: 'GET',
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData?.message || 'Nao foi possivel baixar o curriculo.');
        }
        throw new Error('Nao foi possivel baixar o curriculo.');
      }

      const blob = await response.blob();
      const contentType = response.headers.get('content-type') || blob.type;
      const disposition = response.headers.get('content-disposition') || '';

      let fileName = 'curriculo';
      const match = disposition.match(/filename="?([^"]+)"?/i);
      if (match && match[1]) {
        fileName = match[1];
      }

      return { blob, contentType, fileName };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexao com o servidor. Verifique se o backend esta rodando.');
    }
  },
};

export const auth = {
  saveUser: (userData) => {
    localStorage.setItem('teiaUser', JSON.stringify(userData));
  },

  getUser: () => {
    const userData = localStorage.getItem('teiaUser');
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated: () => {
    return localStorage.getItem('teiaUser') !== null;
  },

  logout: () => {
    localStorage.removeItem('teiaUser');
  },
};

export default candidatoAPI;
