import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { candidatoAPI } from '../../services/api'

export const ContainerFormCadastro = () => {
  const [formData, setFormData] = useState({
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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepPreenchido, setCepPreenchido] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  // Validação de CPF
  const validarCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    return true;
  };

  // Validação de Email
  const validarEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação de Senha
  const validarSenha = (senha) => {
    const senhaRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return senhaRegex.test(senha);
  };

  const validarCEP = (cep) => /^\d{8}$/.test(cep);

  const validarEstado = (estado) => /^[A-Za-z]{2}$/.test(estado);

  // Busca endereço via ViaCEP
  const buscarCEP = async (cep) => {
    if (!validarCEP(cep)) return;

    setCepLoading(true);
    const newErrors = { ...errors };
    delete newErrors.cep;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        newErrors.cep = 'CEP não encontrado';
        setErrors(newErrors);
        setCepPreenchido(false);
        return;
      }

      // Preenche os campos com os dados do ViaCEP
      setFormData(prev => ({
        ...prev,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || ''
      }));

      setCepPreenchido(true);
      setErrors(newErrors);
    } catch {
      newErrors.cep = 'Erro ao buscar CEP. Tente novamente.';
      setErrors(newErrors);
      setCepPreenchido(false);
    } finally {
      setCepLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let finalValue = value;
    if (name === 'cpf' || name === 'cep') {
      finalValue = value.replace(/\D/g, '');
    }
    if (name === 'estado') {
      finalValue = value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));

    // Validação em tempo real
    const newErrors = { ...errors };
    
    if (name === 'cpf' && finalValue.length > 0) {
      if (!validarCPF(finalValue)) {
        newErrors.cpf = 'CPF deve conter exatamente 11 números';
      } else {
        delete newErrors.cpf;
      }
    }
    
    if (name === 'email' && value.length > 0) {
      if (!validarEmail(value)) {
        newErrors.email = 'Digite um email válido';
      } else {
        delete newErrors.email;
      }
    }
    
    if (name === 'senha' && value.length > 0) {
      if (!validarSenha(value)) {
        newErrors.senha = 'Senha deve ter pelo menos 8 caracteres, uma letra maiúscula e um caractere especial';
      } else {
        delete newErrors.senha;
      }
    }

    if (name === 'cep' && finalValue.length > 0) {
      if (!validarCEP(finalValue)) {
        newErrors.cep = 'CEP deve conter exatamente 8 números';
        setCepPreenchido(false);
      } else {
        delete newErrors.cep;
        // Dispara busca automática ao completar 8 dígitos
        buscarCEP(finalValue);
      }
    }

    // Se apagar o CEP, libera campos para edição manual
    if (name === 'cep' && finalValue.length === 0) {
      setCepPreenchido(false);
    }

    if (name === 'estado' && finalValue.length > 0) {
      if (!validarEstado(finalValue)) {
        newErrors.estado = 'Informe a UF com 2 letras (ex.: SP)';
      } else {
        delete newErrors.estado;
      }
    }
    
    setErrors(newErrors);
  };

  const isFormValid = () => {
    return (
      formData.nome.trim().length > 0 &&
      validarCPF(formData.cpf) &&
      validarEmail(formData.email) &&
      validarSenha(formData.senha) &&
      validarCEP(formData.cep) &&
      formData.logradouro.trim().length > 0 &&
      formData.numero.trim().length > 0 &&
      formData.bairro.trim().length > 0 &&
      formData.cidade.trim().length > 0 &&
      validarEstado(formData.estado) &&
      Object.keys(errors).length === 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setMessage({ text: 'Por favor, corrija os erros no formulário', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await candidatoAPI.cadastrar(formData);

      if (response.success && response.data.success) {
        // Mostrar mensagem de sucesso
        setMessage({ text: response.data.message + ' Redirecionando...', type: 'success' });
        
        // Limpar formulário
        setFormData({
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
        setErrors({});
        
        // Redirecionar para login após 1.5 segundos
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        // Tratar erro retornado pelo backend
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
        <div className="login-form-section cadastro-form-section">
          <div className="login-form-container">
            <h2>Crie sua Conta</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="cadastro-frames-grid">
                <section className="cadastro-frame">
                  <h3 className="cadastro-frame-title">Informações Básicas</h3>

                  <div className="form-group">
                    <label htmlFor="nome">Nome Completo:</label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cpf">CPF:</label>
                    <input
                      type="text"
                      id="cpf"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      maxLength="11"
                      placeholder="Apenas números"
                      disabled={loading}
                      required
                    />
                    {errors.cpf && <span className="error-message">{errors.cpf}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="senha">Senha:</label>
                    <input
                      type="password"
                      id="senha"
                      name="senha"
                      value={formData.senha}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    {errors.senha && <span className="error-message">{errors.senha}</span>}
                  </div>
                </section>

                <section className="cadastro-frame">
                  <h3 className="cadastro-frame-title">Endereço</h3>

                  <div className="form-row col-auto-small">
                    <div className="form-group">
                      <label htmlFor="cep">CEP:</label>
                      <div className="input-with-loader">
                        <input
                          type="text"
                          id="cep"
                          name="cep"
                          value={formData.cep}
                          onChange={handleChange}
                          maxLength="8"
                          placeholder="Apenas números"
                          disabled={loading || cepLoading}
                          required
                        />
                        {cepLoading && <span className="cep-spinner" />}
                      </div>
                      {errors.cep && <span className="error-message">{errors.cep}</span>}
                      {cepPreenchido && !errors.cep && (
                        <span className="success-message">✓ Endereço encontrado</span>
                      )}
                    </div>

                    <div className="form-group field-small">
                      <label htmlFor="numero">Nº:</label>
                      <input
                        type="text"
                        id="numero"
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row two-cols">
                    <div className="form-group">
                      <label htmlFor="logradouro">Logradouro:</label>
                      <input
                        type="text"
                        id="logradouro"
                        name="logradouro"
                        value={formData.logradouro}
                        onChange={handleChange}
                        disabled={loading}
                        readOnly={cepPreenchido && formData.logradouro !== ''}
                        className={cepPreenchido && formData.logradouro !== '' ? 'field-autofilled' : ''}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="complemento">Complemento:</label>
                      <input
                        type="text"
                        id="complemento"
                        name="complemento"
                        value={formData.complemento}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="bairro">Bairro:</label>
                    <input
                      type="text"
                      id="bairro"
                      name="bairro"
                      value={formData.bairro}
                      onChange={handleChange}
                      disabled={loading}
                      readOnly={cepPreenchido && formData.bairro !== ''}
                      className={cepPreenchido && formData.bairro !== '' ? 'field-autofilled' : ''}
                      required
                    />
                  </div>

                  <div className="form-row col-auto-small">
                    <div className="form-group">
                      <label htmlFor="cidade">Cidade:</label>
                      <input
                        type="text"
                        id="cidade"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        disabled={loading}
                        readOnly={cepPreenchido && formData.cidade !== ''}
                        className={cepPreenchido && formData.cidade !== '' ? 'field-autofilled' : ''}
                        required
                      />
                    </div>

                    <div className="form-group field-small">
                      <label htmlFor="estado">UF:</label>
                      <input
                        type="text"
                        id="estado"
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        maxLength="2"
                        placeholder="SP"
                        disabled={loading}
                        readOnly={cepPreenchido && formData.estado !== ''}
                        className={cepPreenchido && formData.estado !== '' ? 'field-autofilled' : ''}
                        required
                      />
                      {errors.estado && <span className="error-message">{errors.estado}</span>}
                    </div>
                  </div>
                </section>
              </div>
              
              {message.text && (
                <div className={`form-message ${message.type}`}>
                  {message.text}
                </div>
              )}
              
              <button 
                type="submit" 
                className="login-button"
                disabled={!isFormValid() || loading}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </form>
            
            <div className="signup-link">
              <p>Já tem uma conta? <Link to="/login">Faça login aqui</Link></p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
