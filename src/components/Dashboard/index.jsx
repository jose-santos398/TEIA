import logoBR from '../../assets/logoBR.png'
import { Link } from 'react-router-dom'

export const Dashboard = () => {
  return (
  <><main>
    <section className="welcome-message">
      <h1>Conectando estudantes e profissionais de tecnologia ao mercado</h1>
      <p>A ponte entre sua formação e o primeiro emprego na área de tecnologia</p>
      <Link to="/cadastro" className="cta-button">Cadastre-se Agora</Link>
    </section>

    <section className="info-image-section">
      <div className="info-box">
        <h2 className="section-label">COMO FUNCIONA?</h2>
        <h1>Criado de estudantes para estudantes,</h1>
        <h1>a Teia surge como uma plataforma para ajudar 
        aspirantes da tecnologia e profissionais em início de carreira a 
        se prepararem para o mercado de trabalho.</h1>
      </div>

      <div className="image-container">
        <img src={logoBR} alt="Imagem ilustrativa" />
      </div>
    </section>
  </main>
  
  <section>
  <h2 class="section-title">O que você encontrará por aqui:</h2>
  <div class="cards-container">
    <div class="custom-card">
      <div class="custom-icon icon-blue">✅</div>
      <h5>Cadastro Completo</h5>
      <p>Crie seu perfil e envie seu currículo para ser encontrado por empresas.</p>
    </div>
    <div class="custom-card">
      <div class="custom-icon icon-red">💼</div>
      <h5>Vagas Personalizadas</h5>
      <p>Encontre oportunidades alinhadas com seu perfil e nível de experiência.</p>
    </div>
    <div class="custom-card">
      <div class="custom-icon icon-yellow">📚</div>
      <h5>Cursos Recomendados</h5>
      <p>Receba sugestões de cursos para preencher lacunas em seu conhecimento.</p>
    </div>
  </div>
</section>

  <footer>
    <p>© 2025 Teia - Inovando por um futuro brilhante!</p>
  </footer></>
    

  
  )
}
