import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { candidatoAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

export const ContainerForm = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mode, setMode] = useState('login');
  const [cadastroData, setCadastroData] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });
  const [cadastroErrors, setCadastroErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    return true;
  };

  const validarEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const validarSenha = (senhaValue) => {
    const senhaRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return senhaRegex.test(senhaValue);
  };

  const validarCEP = (cep) => /^\d{8}$/.test(cep);

  const validarEstado = (estado) => /^[A-Za-z]{2}$/.test(estado);

  const handleCadastroChange = (e) => {
    const { name, value } = e.target;

    let finalValue = value;
    if (name === 'cpf' || name === 'cep') {
      finalValue = value.replace(/\D/g, '');
    }
    if (name === 'estado') {
      finalValue = value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2);
    }

    setCadastroData((prev) => ({
      ...prev,
      [name]: finalValue
    }));

    const newErrors = { ...cadastroErrors };

    if (name === 'cpf' && finalValue.length > 0) {
      if (!validarCPF(finalValue)) {
        newErrors.cpf = 'CPF deve conter exatamente 11 números';
      } else {
        delete newErrors.cpf;
      }
    }

    if (name === 'email' && finalValue.length > 0) {
      if (!validarEmail(finalValue)) {
        newErrors.email = 'Digite um email válido';
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'senha' && finalValue.length > 0) {
      if (!validarSenha(finalValue)) {
        newErrors.senha = 'Senha deve ter pelo menos 8 caracteres, uma letra maiúscula e um caractere especial';
      } else {
        delete newErrors.senha;
      }
    }

    if (name === 'cep' && finalValue.length > 0) {
      if (!validarCEP(finalValue)) {
        newErrors.cep = 'CEP deve conter exatamente 8 números';
      } else {
        delete newErrors.cep;
      }
    }

    if (name === 'estado' && finalValue.length > 0) {
      if (!validarEstado(finalValue)) {
        newErrors.estado = 'Informe a UF com 2 letras (ex.: SP)';
      } else {
        delete newErrors.estado;
      }
    }

    setCadastroErrors(newErrors);
  };

  const isCadastroValid = () => {
    return (
      cadastroData.nome.trim().length > 0 &&
      validarCPF(cadastroData.cpf) &&
      validarEmail(cadastroData.email) &&
      validarSenha(cadastroData.senha) &&
      validarCEP(cadastroData.cep) &&
      cadastroData.logradouro.trim().length > 0 &&
      cadastroData.numero.trim().length > 0 &&
      cadastroData.bairro.trim().length > 0 &&
      cadastroData.cidade.trim().length > 0 &&
      validarEstado(cadastroData.estado) &&
      Object.keys(cadastroErrors).length === 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await candidatoAPI.login({ email, senha });

      if (response.success && response.data.success) {
        // Salvar dados do usuário usando o AuthContext
        login(response.data.data);

        // Mostrar mensagem de sucesso
        setMessage({ text: response.data.message, type: 'success' });

        // Limpar formulário
        setEmail('');
        setSenha('');

        // Redirecionar para dashboard após 1 segundo
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        // Tratar erro retornado pelo backend
        setMessage({
          text: response.data?.message || 'Email ou senha incorretos',
          type: 'error'
        });
      }
    } catch (error) {
      setMessage({
        text: error.message || 'Erro de conexão. Verifique se o servidor está rodando.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCadastroSubmit = async (e) => {
    e.preventDefault();

    if (!isCadastroValid()) {
      setMessage({ text: 'Por favor, corrija os erros no formulário', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await candidatoAPI.cadastrar(cadastroData);

      if (response.success && response.data.success) {
        setMessage({ text: response.data.message + ' Agora faça login.', type: 'success' });
        setEmail(cadastroData.email);
        setSenha('');
        setCadastroData({
          nome: '',
          cpf: '',
          email: '',
          senha: '',
          cep: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: ''
        });
        setCadastroErrors({});
        setMode('login');
      } else {
        setMessage({
          text: response.data?.message || 'Erro ao cadastrar. Tente novamente.',
          type: 'error'
        });
      }
    } catch (error) {
      setMessage({
        text: error.message || 'Erro de conexão. Verifique se o servidor está rodando.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-main">
      <div className="login-container">
        <div className={`login-form-section ${mode === 'cadastro' ? 'cadastro-form-section' : ''}`}>
          <div className="login-form-container">
            <h2>{mode === 'login' ? 'Login' : 'Cadastre-se'}</h2>
            {mode === 'login' ? (
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="senha">Senha:</label>
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                {message.text && (
                  <div className={`form-message ${message.type}`}>
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Logar'}
                </button>
              </form>
            ) : (
              <form className="login-form" onSubmit={handleCadastroSubmit}>
                <div className="form-group">
                  <label htmlFor="nome">Nome Completo:</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={cadastroData.nome}
                    onChange={handleCadastroChange}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cpf-cadastro">CPF:</label>
                  <input
                    type="text"
                    id="cpf-cadastro"
                    name="cpf"
                    value={cadastroData.cpf}
                    onChange={handleCadastroChange}
                    maxLength="11"
                    placeholder="Apenas números"
                    disabled={loading}
                    required
                  />
                  {cadastroErrors.cpf && <span className="error-message">{cadastroErrors.cpf}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email-cadastro">Email:</label>
                  <input
                    type="email"
                    id="email-cadastro"
                    name="email"
                    value={cadastroData.email}
                    onChange={handleCadastroChange}
                    disabled={loading}
                    required
                  />
                  {cadastroErrors.email && <span className="error-message">{cadastroErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="senha-cadastro">Senha:</label>
                  <input
                    type="password"
                    id="senha-cadastro"
                    name="senha"
                    value={cadastroData.senha}
                    onChange={handleCadastroChange}
                    disabled={loading}
                    required
                  />
                  {cadastroErrors.senha && <span className="error-message">{cadastroErrors.senha}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cep-cadastro">CEP:</label>
                  <input
                    type="text"
                    id="cep-cadastro"
                    name="cep"
                    value={cadastroData.cep}
                    onChange={handleCadastroChange}
                    maxLength="8"
                    placeholder="Apenas números"
                    disabled={loading}
                    required
                  />
                  {cadastroErrors.cep && <span className="error-message">{cadastroErrors.cep}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="logradouro-cadastro">Logradouro:</label>
                  <input
                    type="text"
                    id="logradouro-cadastro"
                    name="logradouro"
                    value={cadastroData.logradouro}
                    onChange={handleCadastroChange}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="numero-cadastro">Número:</label>
                  <input
                    type="text"
                    id="numero-cadastro"
                    name="numero"
                    value={cadastroData.numero}
                    onChange={handleCadastroChange}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="complemento-cadastro">Complemento:</label>
                  <input
                    type="text"
                    id="complemento-cadastro"
                    name="complemento"
                    value={cadastroData.complemento}
                    onChange={handleCadastroChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bairro-cadastro">Bairro:</label>
                  <input
                    type="text"
                    id="bairro-cadastro"
                    name="bairro"
                    value={cadastroData.bairro}
                    onChange={handleCadastroChange}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cidade-cadastro">Cidade:</label>
                  <input
                    type="text"
                    id="cidade-cadastro"
                    name="cidade"
                    value={cadastroData.cidade}
                    onChange={handleCadastroChange}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="estado-cadastro">Estado (UF):</label>
                  <input
                    type="text"
                    id="estado-cadastro"
                    name="estado"
                    value={cadastroData.estado}
                    onChange={handleCadastroChange}
                    maxLength="2"
                    placeholder="Ex.: SP"
                    disabled={loading}
                    required
                  />
                  {cadastroErrors.estado && <span className="error-message">{cadastroErrors.estado}</span>}
                </div>

                {message.text && (
                  <div className={`form-message ${message.type}`}>
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  className="login-button"
                  disabled={!isCadastroValid() || loading}
                >
                  {loading ? 'Cadastrando...' : 'Criar Conta'}
                </button>
              </form>
            )}

            <div className="signup-link">
              <p>Preferir fluxo completo? <Link to="/cadastro">Abra a tela de cadastro</Link></p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
