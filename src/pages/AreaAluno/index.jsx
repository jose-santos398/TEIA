import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { candidatoAPI } from "../../services/api";

export const AreaAlunoPage = () => {
  const { user, login } = useAuth();
  const [curriculoFile, setCurriculoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setMessage({ text: "", type: "" });

    if (!file) {
      setCurriculoFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage({ text: "Formato inválido. Envie PDF, DOC ou DOCX.", type: "error" });
      setCurriculoFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ text: "O arquivo deve ter no máximo 5MB.", type: "error" });
      setCurriculoFile(null);
      return;
    }

    setCurriculoFile(file);
  };

  const handleUpload = async () => {
    if (!user?.candidato_id) {
      setMessage({ text: "Usuário não identificado para upload.", type: "error" });
      return;
    }

    if (!curriculoFile) {
      setMessage({ text: "Selecione um arquivo antes de enviar.", type: "error" });
      return;
    }

    setUploading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await candidatoAPI.uploadCurriculo(user.candidato_id, curriculoFile);

      if (response.success && response.data?.success) {
        if (response.data?.data) {
          login(response.data.data);
        }
        setMessage({ text: "Currículo enviado com sucesso!", type: "success" });
        setCurriculoFile(null);
      } else {
        setMessage({
          text: response.data?.message || "Não foi possível enviar o currículo.",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({ text: error.message || "Erro ao enviar currículo.", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="aluno-container">

      <section className="card-aluno">
        <div className="foto-aluno">
          <img src="/img/user-profile.png" alt="Foto do aluno" />
        </div>

        <h2>{user?.nome}</h2>
        <p className="nivel">Nível {user?.nivel || 1} 🎯</p>

        <div className="progresso-container">
          <p>Progresso na plataforma</p>
          <div className="barra">
            <div className="barra-preenchida" style={{ width: "60%" }}></div>
          </div>
          <span>60% Concluído</span>
        </div>

        <div className="upload-cv">
          <label className="cv-label">Enviar Currículo</label>
          <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" disabled={uploading} />
          <button type="button" onClick={handleUpload} disabled={uploading || !curriculoFile}>
            {uploading ? "Enviando..." : "Enviar currículo"}
          </button>
          {user?.possuiCurriculo && user?.curriculoNomeArquivo && (
            <p className="cv-info">Currículo atual: {user.curriculoNomeArquivo}</p>
          )}
          {message.text && <p className={`cv-info ${message.type}`}>{message.text}</p>}
        </div>
      </section>

      <section className="cursos-section">
        <h2>Cursos Recomendados</h2>
        <div className="cursos-grid">
          <a href="https://youtu.be/PKwu15ldZ7k" target="_blank" rel="noopener noreferrer" className="curso-card">
            <h3>HTML + CSS Completo</h3>
            <p>Aula completa para iniciantes</p>
          </a>

          <a href="https://youtu.be/3PHXvlpOkf4" target="_blank" rel="noopener noreferrer" className="curso-card">
            <h3>JavaScript Iniciante</h3>
            <p>Fundamentos essenciais</p>
          </a>

          <a href="https://youtu.be/j942wKiXFu8" target="_blank" rel="noopener noreferrer" className="curso-card">
            <h3>React do Zero</h3>
            <p>React moderno explicado</p>
          </a>
        </div>
      </section>

    </main>
  );
};
