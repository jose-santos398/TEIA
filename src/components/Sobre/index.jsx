import Ana from '../../assets/Ana.jpeg'
import bruna from '../../assets/bruna.jpeg'
import cleverson from '../../assets/cleverson.jpeg'
import jose from '../../assets/jose.jpeg'
import lucas from '../../assets/lucas.jpeg'
import thais from '../../assets/thais.jpeg'

export const Sobre = () => {
  return (
    <>
     <main className="sobre-container">
    <section className="sobre-intro">
      <h1>Sobre Nós</h1>
      <p>A Teia nasceu para conectar estudantes e profissionais de tecnologia ao mercado, oferecendo recursos e oportunidades para crescer na carreira.</p>
    </section>

    <section className="sobre-missao">
      <div className="custom-card">
        <h3>Missão🎯</h3>
        <p>Capacitar e conectar pessoas da tecnologia ao mercado de trabalho.</p>
      </div>
      <div className="custom-card">
        <h3>Visão🌍</h3>
        <p>Ser referência na formação e empregabilidade na área de tecnologia.</p>
      </div>
      <div className="custom-card">
        <h3>Valores🤝</h3>
        <p>Inovação, inclusão e compromisso com o aprendizado.</p>
      </div>
    </section>

   <section className="equipe-section">
  <h2>Nosso Time</h2>
  <div className="equipe-grid">
    <div className="equipe-card">
      <img src={Ana} alt="Ana Luiza"/>
      <p className="nome">Ana Luiza</p>
      <span className="cargo">Desenvolvedora</span>
    </div>
    <div className="equipe-card">
      <img src={bruna} alt="Bruna Lopez"/>
      <p className="nome">Bruna Lopez</p>
      <span className="cargo">Desenvolvedora</span>
    </div>
    <div className="equipe-card">
      <img src={cleverson} alt="Cleverson Amorim"/>
      <p className="nome">Cleverson Amorim</p>
      <span className="cargo">Desenvolvedor</span>
    </div>
    <div className="equipe-card">
      <img src={jose} alt="José Luiz"/>
      <p className="nome">José Luiz</p>
      <span className="cargo">Desenvolvedor</span>
    </div>
    <div className="equipe-card">
      <img src={lucas} alt="Lucas Willians"/>
      <p className="nome">Lucas Willians</p>
      <span className="cargo">Desenvolvedor</span>
    </div>
    <div className="equipe-card">
      <img src={thais} alt="Thais Ferreira"/>
      <p className="nome">Thais Ferreira</p>
      <span className="cargo">Desenvolvedora</span>
    </div>
  </div>
</section>

  </main>
    </>
  )
}
