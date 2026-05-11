export const Contato = () => {
  return (
    <>
    <main>
    <section className="contato-container">
        <form className="form-contato" id="formContato">
            <label for="nome">Nome</label>
            <input type="text" id="nome" name="nome" placeholder="Seu nome" required/>

            <label for="email">E-mail</label>
            <input type="email" id="email" name="email" placeholder="Seu e-mail" required/>

            <label for="mensagem">Mensagem</label>
            <textarea id="mensagem" name="mensagem" rows="5" placeholder="Digite sua mensagem" required/>

            <button type="submit">Enviar</button>
        </form>

        <div className="info-contato">
            <h2>Outros canais</h2>
            <p><strong>Email:</strong> contato@teia.com</p>
            <p><strong>Telefone:</strong> (11) 4002-8922</p>
            <p><strong>Endereço:</strong> Rua da Resenha, 123 - São Paulo, SP</p>
        </div>
    </section>
  </main>


  <footer>
    <p>© 2025 Teia - Inovando por um futuro brilhante!</p>
  </footer>
    </>
  )
}
