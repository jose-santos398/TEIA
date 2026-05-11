import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';

const COURSES = [
  {
    id: 'novo-emprego',
    title: 'Como Conseguir um Novo Emprego',
    area: 'Desenvolvimento Pessoal e Profissional',
    duration: '4h',
    level: 'Iniciante',
    url: 'https://www.ev.org.br/cursos/Como-Conseguir-um-Novo-Emprego',
    description: 'Prepare seu curriculo, busca por vagas, entrevista e perfil no LinkedIn.',
    keywords: ['curriculo', 'entrevista', 'linkedin', 'vaga', 'vagas', 'objetivo profissional', 'emprego'],
  },
  {
    id: 'desenvolvimento-profissional',
    title: 'Desenvolvimento Profissional',
    area: 'Desenvolvimento Pessoal e Profissional',
    duration: '8h',
    level: 'Iniciante',
    url: 'https://www.ev.org.br/cursos/desenvolvimento-profissional',
    description: 'Fortaleca plano de carreira, soft skills, hard skills, networking e aprendizado continuo.',
    keywords: ['carreira', 'networking', 'soft skills', 'hard skills', 'desenvolvimento profissional'],
  },
  {
    id: 'comunicacao-empresarial',
    title: 'Comunicacao Empresarial',
    area: 'Desenvolvimento Pessoal e Profissional',
    duration: '12h',
    level: 'Iniciante',
    url: 'https://www.ev.org.br/cursos/comunicacao-empresarial',
    description: 'Melhore sua comunicacao no trabalho, apresentacoes e clareza ao defender ideias.',
    keywords: ['comunicacao', 'apresentacao', 'clareza', 'expressar', 'ideias'],
  },
  {
    id: 'comunicacao-escrita',
    title: 'Comunicacao Escrita: Ortografia, Gramatica e Texto',
    area: 'Desenvolvimento Pessoal e Profissional',
    duration: '16h',
    level: 'Iniciante',
    url: 'https://www.ev.org.br/cursos/comunicacao_escrita',
    description: 'Aprimore ortografia, gramatica, pontuacao e construcao de textos profissionais.',
    keywords: ['escrita', 'portugues', 'gramatica', 'ortografia', 'texto', 'clareza textual', 'pontuacao'],
  },
  {
    id: 'lingua-portuguesa',
    title: 'Lingua Portuguesa sem Complicacoes',
    area: 'Desenvolvimento Pessoal e Profissional',
    duration: '20h',
    level: 'Iniciante',
    url: 'https://www.ev.org.br/cursos/lingua-portuguesa-sem-complicacoes',
    description: 'Revise pontos essenciais da lingua portuguesa para se comunicar melhor.',
    keywords: ['portugues', 'lingua portuguesa', 'redacao', 'norma culta'],
  },
  {
    id: 'organizacao-pessoal',
    title: 'Organizacao Pessoal',
    area: 'Desenvolvimento Pessoal e Profissional',
    duration: '10h',
    level: 'Iniciante',
    url: 'https://www.ev.org.br/cursos/organizacao-pessoal',
    description: 'Organize tempo, rotina, prioridades e atividades para trabalhar com mais foco.',
    keywords: ['organizacao', 'foco', 'tempo', 'rotina', 'prioridade', 'planejamento'],
  },
  {
    id: 'site-html-css-js',
    title: 'Crie um site simples usando HTML, CSS e JavaScript',
    area: 'Programacao',
    duration: '2h',
    level: 'Iniciante',
    url: 'https://www.ev.org.br/cursos/crie-um-site-simples-usando-html-css-e-javascript',
    description: 'Aprenda fundamentos de desenvolvimento web com HTML, CSS e JavaScript.',
    keywords: ['tecnologia', 'html', 'css', 'javascript', 'web', 'programacao', 'site'],
  },
  {
    id: 'postura-imagem',
    title: 'Postura e Imagem Profissional',
    area: 'Desenvolvimento Pessoal e Profissional',
    duration: '8h',
    level: 'Iniciante',
    url: 'https://www.ev.org.br/cursos/postura-e-imagem-profissional',
    description: 'Aprimore postura, imagem profissional e convivencia no ambiente de trabalho.',
    keywords: ['postura', 'imagem profissional', 'apresentacao pessoal', 'comportamento'],
  },
];

const DEFAULT_COURSE = COURSES[0];
const CURATED_COURSE_IDS = [
  'novo-emprego',
  'desenvolvimento-profissional',
  'comunicacao-empresarial',
  'comunicacao-escrita',
  'lingua-portuguesa',
  'organizacao-pessoal',
  'site-html-css-js',
];

const normalizeText = (value = '') =>
  value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const getImprovementText = (analysisData) => {
  const improvements = Array.isArray(analysisData?.pontosMelhoria) ? analysisData.pontosMelhoria : [];
  return normalizeText(improvements.join(' '));
};

const recommendCourse = (analysisData) => {
  const improvementText = getImprovementText(analysisData);

  if (!improvementText) {
    return {
      course: DEFAULT_COURSE,
      reason: 'Este curso e um bom ponto de partida para transformar a analise do curriculo em proximos passos praticos.',
    };
  }

  const rankedCourses = COURSES.map((course) => {
    const score = course.keywords.reduce((total, keyword) => {
      return improvementText.includes(normalizeText(keyword)) ? total + 1 : total;
    }, 0);

    return { course, score };
  }).sort((left, right) => right.score - left.score);

  const bestMatch = rankedCourses[0];

  if (!bestMatch || bestMatch.score === 0) {
    return {
      course: DEFAULT_COURSE,
      reason: 'A analise trouxe melhorias gerais; este curso ajuda a revisar curriculo, vagas, entrevista e LinkedIn.',
    };
  }

  return {
    course: bestMatch.course,
    reason: `Recomendado porque seus pontos de melhoria mencionam temas ligados a ${bestMatch.course.area.toLowerCase()}.`,
  };
};

const CourseCard = ({ course, variant = 'default', reason }) => (
  <article className={`course-card ${variant === 'featured' ? 'course-card-featured' : ''}`}>
    <div className="course-card-topline">
      <span>{course.area}</span>
      <span>{course.duration}</span>
    </div>
    <h3>{course.title}</h3>
    <p>{course.description}</p>
    {reason && <p className="course-reason">{reason}</p>}
    <div className="course-card-footer">
      <span className="course-level">{course.level}</span>
      <a href={course.url} target="_blank" rel="noopener noreferrer" className="course-link">
        Acessar curso
      </a>
    </div>
  </article>
);

export const CursosRecomendadosPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const analysisData = location.state?.analysisData;
  const hasAnalysis = Boolean(analysisData);
  const recommendation = recommendCourse(analysisData);
  const curatedCourses = COURSES.filter((course) => CURATED_COURSE_IDS.includes(course.id));
  const otherCourses = curatedCourses.filter((course) => course.id !== recommendation.course.id);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return (
    <>
      <Header />

      <main className="dashboard-main recommended-courses-main">
        <div className="dashboard-container">
          <section className="dashboard-hero recommended-courses-hero">
            <div className="dashboard-hero-copy">
              <span className="dashboard-hero-kicker">Cursos gratuitos</span>
              <h1>Curso recomendado para seu proximo passo</h1>
              <p className="dashboard-hero-text">
                Com base nos pontos de melhoria da analise do curriculo, separamos uma recomendacao da
                Escola Virtual da Fundacao Bradesco e outros cursos que podem fortalecer seu perfil.
              </p>
            </div>

            <div className="dashboard-hero-statuses">
              <div className="dashboard-mini-card">
                <span className="dashboard-mini-label">Fonte</span>
                <strong>Fundacao Bradesco</strong>
              </div>
              <div className="dashboard-mini-card">
                <span className="dashboard-mini-label">Formato</span>
                <strong>Gratuito e online</strong>
              </div>
            </div>
          </section>

          {!hasAnalysis ? (
            <section className="dashboard-card analysis-empty-state recommended-empty-state">
              <strong>Nenhuma analise encontrada</strong>
              <p>
                Para receber uma recomendacao personalizada, volte ao dashboard, envie seu curriculo em PDF e conclua
                a analise com IA.
              </p>
              <button type="button" onClick={() => navigate('/dashboard')} className="curriculo-btn curriculo-btn-primary">
                Voltar para analisar curriculo
              </button>
            </section>
          ) : (
            <>
              <section className="recommended-layout">
                <div className="recommended-summary">
                  <span className="analysis-kicker">Recomendacao principal</span>
                  <h2>{recommendation.course.title}</h2>
                  <p>{recommendation.reason}</p>
                  {analysisData.pontosMelhoria?.length ? (
                    <div className="improvement-box">
                      <span>Pontos considerados</span>
                      <ul>
                        {analysisData.pontosMelhoria.map((item) => (
                          <li key={`considerado-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                <CourseCard course={recommendation.course} variant="featured" reason={recommendation.reason} />
              </section>

              <section className="dashboard-card course-list-section">
                <div className="card-header">
                  <span className="card-header-icon">Cursos</span>
                  <div>
                    <h2>Outros cursos da Fundacao Bradesco</h2>
                    <p className="card-subtitle">Uma lista curada para complementar sua evolucao profissional.</p>
                  </div>
                </div>

                <div className="course-grid">
                  {otherCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <footer>
        <p>&copy; 2025 Teia - Inovando por um futuro brilhante!</p>
      </footer>
    </>
  );
};
