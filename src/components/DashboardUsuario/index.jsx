import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { candidatoAPI } from '../../services/api';

const EMPTY_MESSAGE = { text: '', type: '' };

export const DashboardUsuario = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [curriculoFile, setCurriculoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(EMPTY_MESSAGE);
  const [analysisMessage, setAnalysisMessage] = useState(EMPTY_MESSAGE);
  const [analysisData, setAnalysisData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [removingCurriculo, setRemovingCurriculo] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);

  const firstName = user?.nome?.split(' ')[0] || 'Aluno';
  const hasUploadedCurriculo = Boolean(user?.possuiCurriculo);

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
      navigate('/login');
    }
  };

  const formatCpf = (cpf = '') => cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

  const clearAnalysisState = () => {
    setAnalysisData(null);
    setAnalysisMessage(EMPTY_MESSAGE);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setUploadMessage(EMPTY_MESSAGE);

    if (!file) {
      setCurriculoFile(null);
      return;
    }

    if (file.type !== 'application/pdf') {
      setUploadMessage({ text: 'Formato invalido. Envie apenas arquivo PDF.', type: 'error' });
      setCurriculoFile(null);
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadMessage({ text: 'O arquivo deve ter no maximo 5MB.', type: 'error' });
      setCurriculoFile(null);
      event.target.value = '';
      return;
    }

    clearAnalysisState();
    setCurriculoFile(file);
  };

  const handleUpload = async () => {
    if (!user?.candidato_id) {
      setUploadMessage({ text: 'Usuario nao identificado para upload.', type: 'error' });
      return;
    }

    if (!curriculoFile) {
      setUploadMessage({ text: 'Selecione um arquivo antes de enviar.', type: 'error' });
      return;
    }

    setUploading(true);
    setUploadMessage(EMPTY_MESSAGE);

    try {
      const response = await candidatoAPI.uploadCurriculo(user.candidato_id, curriculoFile);

      if (response.success && response.data?.success) {
        if (response.data?.data) {
          login(response.data.data);
        }

        clearAnalysisState();
        setUploadMessage({ text: response.data?.message || 'Curriculo enviado com sucesso!', type: 'success' });
        setCurriculoFile(null);
        await carregarPreviewCurriculo(user.candidato_id);
      } else {
        setUploadMessage({
          text: response.data?.message || 'Nao foi possivel enviar o curriculo.',
          type: 'error',
        });
      }
    } catch (error) {
      setUploadMessage({ text: error.message || 'Erro ao enviar curriculo.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyzeCurriculo = async () => {
    if (!user?.candidato_id || !hasUploadedCurriculo) {
      setAnalysisMessage({ text: 'Envie um curriculo em PDF antes de solicitar a analise.', type: 'error' });
      return;
    }

    setAnalyzing(true);
    setAnalysisMessage(EMPTY_MESSAGE);

    try {
      const response = await candidatoAPI.analisarCurriculo(user.candidato_id);

      if (response.success && response.data?.success && response.data?.data) {
        setAnalysisData(response.data.data);
        setAnalysisMessage({
          text: response.data?.message || 'Analise gerada com sucesso.',
          type: 'success',
        });
      } else {
        setAnalysisData(null);
        setAnalysisMessage({
          text: response.data?.message || 'Nao foi possivel analisar o curriculo.',
          type: 'error',
        });
      }
    } catch (error) {
      setAnalysisData(null);
      setAnalysisMessage({
        text: error.message || 'Erro ao analisar curriculo.',
        type: 'error',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRemoveCurriculo = async () => {
    if (!user?.candidato_id || !hasUploadedCurriculo) {
      setUploadMessage({ text: 'Nenhum curriculo enviado para remover.', type: 'error' });
      return;
    }

    if (!window.confirm('Tem certeza que deseja remover o curriculo enviado?')) {
      return;
    }

    setRemovingCurriculo(true);
    setUploadMessage(EMPTY_MESSAGE);

    try {
      const response = await candidatoAPI.removerCurriculo(user.candidato_id);

      if (response.success && response.data?.success) {
        if (response.data?.data) {
          login(response.data.data);
        }

        clearAnalysisState();
        setCurriculoFile(null);
        setUploadMessage({ text: response.data?.message || 'Curriculo removido com sucesso.', type: 'success' });
        setPreviewUrl((currentUrl) => {
          if (currentUrl) {
            URL.revokeObjectURL(currentUrl);
          }
          return '';
        });
      } else {
        setUploadMessage({
          text: response.data?.message || 'Nao foi possivel remover o curriculo.',
          type: 'error',
        });
      }
    } catch (error) {
      setUploadMessage({ text: error.message || 'Erro ao remover curriculo.', type: 'error' });
    } finally {
      setRemovingCurriculo(false);
    }
  };

  const handleViewRecommendedCourse = () => {
    if (!analysisData) {
      return;
    }

    navigate('/cursos-recomendados', { state: { analysisData } });
  };

  const carregarPreviewCurriculo = async (candidatoId) => {
    if (!candidatoId) {
      return;
    }

    setLoadingPreview(true);

    try {
      const { blob, contentType } = await candidatoAPI.baixarCurriculoBlob(candidatoId);

      setPreviewUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }

        if (contentType === 'application/pdf' || blob.type === 'application/pdf') {
          return URL.createObjectURL(blob);
        }

        return '';
      });
    } catch {
      setPreviewUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }
        return '';
      });
    } finally {
      setLoadingPreview(false);
    }
  };

  useEffect(() => {
    if (user?.possuiCurriculo && user?.candidato_id) {
      carregarPreviewCurriculo(user.candidato_id);
    } else {
      setPreviewUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }
        return '';
      });
    }
  }, [user?.candidato_id, user?.possuiCurriculo]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!user) {
    return (
      <main className="dashboard-main">
        <div className="dashboard-container">
          <section className="dashboard-loading-card">
            <span className="btn-spinner"></span>
            <p>Carregando seu dashboard...</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="dashboard-main">
        <div className="dashboard-container">
          <section className="dashboard-hero">
            <div className="dashboard-hero-copy">
              <span className="dashboard-hero-kicker">Area do candidato</span>
              <h1>Ola, {firstName}</h1>
              <p className="dashboard-hero-text">
                Organize seu perfil, envie seu curriculo em PDF e solicite uma leitura rapida com IA
                para descobrir ajustes simples que podem fortalecer sua apresentacao.
              </p>
            </div>

            <div className="dashboard-hero-statuses">
              <div className="dashboard-mini-card">
                <span className="dashboard-mini-label">Curriculo</span>
                <strong>{hasUploadedCurriculo ? 'PDF enviado' : 'Pendente'}</strong>
              </div>
              <div className="dashboard-mini-card">
                <span className="dashboard-mini-label">Analise IA</span>
                <strong>{analysisData ? 'Disponivel' : 'Aguardando'}</strong>
              </div>
            </div>
          </section>

          <div className="dashboard-grid">
            <section className="dashboard-card dashboard-info-card">
              <div className="card-header">
                <span className="card-header-icon">Perfil</span>
                <div>
                  <h2>Seus dados</h2>
                  <p className="card-subtitle">Informacoes principais da sua conta na Teia.</p>
                </div>
              </div>

              <div className="dashboard-info-list">
                <div className="dashboard-info-item">
                  <span className="info-label">Nome completo</span>
                  <span className="info-value">{user.nome}</span>
                </div>
                <div className="dashboard-info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="dashboard-info-item">
                  <span className="info-label">CPF</span>
                  <span className="info-value">{formatCpf(user.cpf)}</span>
                </div>
                <div className="dashboard-info-item">
                  <span className="info-label">ID do candidato</span>
                  <span className="info-value info-value-mono">{user.candidato_id}</span>
                </div>
              </div>
            </section>

            <section className="dashboard-card curriculo-card">
              <div className="card-header">
                <span className="card-header-icon">Curriculo</span>
                <div>
                  <h2>Gestao do curriculo</h2>
                  <p className="card-subtitle">Envie o PDF, confira a visualizacao e solicite a analise quando quiser.</p>
                </div>
              </div>

              <div className="card-content">
                <div className="curriculo-status-row">
                  <div className={`status-badge ${hasUploadedCurriculo ? 'status-active' : 'status-pending'}`}>
                    <span className="status-dot"></span>
                    {hasUploadedCurriculo ? 'Curriculo enviado' : 'Nenhum curriculo enviado'}
                  </div>

                  <div className="curriculo-meta">
                    {user?.curriculoNomeArquivo ? (
                      <span className="curriculo-filename">{user.curriculoNomeArquivo}</span>
                    ) : (
                      <span className="curriculo-filename">Use somente PDF de ate 5MB.</span>
                    )}
                  </div>
                </div>

                <div className="curriculo-panel-grid">
                  <div className="curriculo-upload-panel">
                    <div className="curriculo-upload-zone">
                      <div className="upload-icon">PDF</div>
                      <p className="upload-text">
                        {curriculoFile ? curriculoFile.name : 'Selecione um arquivo PDF para atualizar seu curriculo'}
                      </p>
                      <p className="upload-hint">Formato aceito: PDF. Tamanho maximo: 5MB.</p>
                      <label className="upload-file-label">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,application/pdf"
                          disabled={uploading}
                          className="upload-file-input"
                        />
                        {curriculoFile ? 'Trocar PDF' : 'Escolher PDF'}
                      </label>
                    </div>

                    <div className="curriculo-actions">
                      <button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploading || !curriculoFile}
                        className="curriculo-btn curriculo-btn-primary"
                      >
                        {uploading ? (
                          <>
                            <span className="btn-spinner"></span>
                            Enviando PDF...
                          </>
                        ) : (
                          'Enviar curriculo'
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleAnalyzeCurriculo}
                        disabled={analyzing || !hasUploadedCurriculo}
                        className="curriculo-btn curriculo-btn-secondary"
                      >
                        {analyzing ? (
                          <>
                            <span className="btn-spinner"></span>
                            Analisando...
                          </>
                        ) : (
                          'Analisar curriculo'
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleRemoveCurriculo}
                        disabled={removingCurriculo || uploading || analyzing || !hasUploadedCurriculo}
                        className="curriculo-btn curriculo-btn-danger"
                      >
                        {removingCurriculo ? (
                          <>
                            <span className="btn-spinner"></span>
                            Removendo...
                          </>
                        ) : (
                          'Remover curriculo'
                        )}
                      </button>
                    </div>

                    {uploadMessage.text && (
                      <div className={`curriculo-message ${uploadMessage.type}`}>
                        {uploadMessage.text}
                      </div>
                    )}
                  </div>

                  <div className="curriculo-preview-panel">
                    <div className="curriculo-preview-header">
                      <p className="preview-label">Visualizacao do PDF</p>
                      <span className="preview-caption">
                        {hasUploadedCurriculo ? 'Confira se o arquivo exibido e o correto.' : 'Depois do envio, o preview aparece aqui.'}
                      </span>
                    </div>

                    {loadingPreview ? (
                      <div className="curriculo-preview-loading">
                        <span className="btn-spinner"></span>
                        Carregando visualizacao...
                      </div>
                    ) : previewUrl ? (
                      <div className="curriculo-preview">
                        <iframe
                          src={previewUrl}
                          title="Visualizador de curriculo"
                          className="curriculo-iframe"
                        />
                      </div>
                    ) : (
                      <div className="curriculo-empty-preview">
                        <strong>Preview indisponivel</strong>
                        <p>Envie um arquivo PDF para visualizar o curriculo diretamente no dashboard.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="dashboard-card analysis-card">
            <div className="card-header">
              <span className="card-header-icon">Analise IA</span>
              <div>
                <h2>Leitura rapida do seu curriculo</h2>
                <p className="card-subtitle">Receba um resumo simples, pontos fortes e oportunidades de melhoria.</p>
              </div>
            </div>

            <div className="analysis-card-content">
              {analysisMessage.text && (
                <div className={`curriculo-message ${analysisMessage.type}`}>
                  {analysisMessage.text}
                </div>
              )}

              {analysisData ? (
                <div className="analysis-result-grid">
                  <section className="analysis-summary-panel">
                    <span className="analysis-kicker">Resumo</span>
                    <p className="analysis-summary-text">{analysisData.resumo}</p>
                    <div className="analysis-file-chip">{analysisData.nomeArquivo}</div>
                  </section>

                  <section className="analysis-list-panel">
                    <div className="analysis-column">
                      <h3>Pontos fortes</h3>
                      {analysisData.pontosFortes?.length ? (
                        <ul className="analysis-list">
                          {analysisData.pontosFortes.map((item) => (
                            <li key={`forte-${item}`}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="analysis-empty-text">Nenhum ponto forte foi retornado nesta analise.</p>
                      )}
                    </div>

                    <div className="analysis-column">
                      <h3>Pontos de melhoria</h3>
                      {analysisData.pontosMelhoria?.length ? (
                        <ul className="analysis-list analysis-list-improvement">
                          {analysisData.pontosMelhoria.map((item) => (
                            <li key={`melhoria-${item}`}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="analysis-empty-text">Nenhuma melhoria foi retornada nesta analise.</p>
                      )}
                    </div>
                  </section>

                  <section className="analysis-final-panel">
                    <span className="analysis-kicker">Orientacao final</span>
                    <p>{analysisData.mensagemFinal}</p>
                    <button
                      type="button"
                      onClick={handleViewRecommendedCourse}
                      className="curriculo-btn curriculo-btn-primary analysis-course-button"
                    >
                      Ver curso recomendado
                    </button>
                  </section>
                </div>
              ) : (
                <div className="analysis-empty-state">
                  <strong>Sua analise vai aparecer aqui</strong>
                  <p>
                    Depois de enviar um curriculo em PDF, clique em <em>Analisar curriculo</em> para ver um resumo,
                    os pontos fortes e sugestoes simples de melhoria.
                  </p>
                </div>
              )}
            </div>
          </section>

          <div className="dashboard-footer-actions">
            <button onClick={handleLogout} className="login-button dashboard-logout-button">
              Sair
            </button>
          </div>
        </div>
      </main>

      <footer>
        <p>© 2025 Teia - Inovando por um futuro brilhante!</p>
      </footer>
    </>
  );
};
