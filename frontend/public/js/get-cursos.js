const divCursos = document.querySelector("#cursos");
const cursoIns = document.querySelector("#cursos-inscrito");

async function consultaCursos() {
  const response = await fetch("http://localhost:3000/cursos");
  const cursos = await response.json();

  const responseCategorias = await fetch("http://localhost:3000/categoria");
  const categorias = await responseCategorias.json();

  preencheTela(cursos, categorias);
}

async function consultaCursosInscrito(userId) {
  const response = await fetch(`http://localhost:3000/inscrever/${userId}/cursos`);
  const userCursos = await response.json();

  const responseCategorias = await fetch("http://localhost:3000/categoria");
  const categorias = await responseCategorias.json();

  preencheTelaInscrito(userCursos, categorias);
}

function preencheTela(cursos, categorias) {
  cursos.forEach((curso) => {
    // Encontra a categoria correspondente pelo ID
    const categoria = categorias.find((categoria) => categoria.id === curso.categoriaId);

    const novoCursoHTML = `
    <div class="card">
    <div class="card-image" >
      <img
        src="/images/cards/${curso.image}"
        width="100%"
        alt="SGC logo"
      />
    </div>
    <div class="card-content">
      <h2 class="card-title">${curso.name}</h2>
      <p>
      ${curso.description}
      </p>
    </div>
    <div class="card-footer">
      <p class="Categoria">${categoria.name}</p>
      <a href="/pagina-curso/${curso.id}"
        >
        <button type="button" class="action">Inscrever-se</button></a
      >
    </div>
  </div>
    `;
    divCursos.innerHTML = divCursos.innerHTML + novoCursoHTML;
  });
}

consultaCursos();
// Obtenha o ID do usuário armazenado no Local Storage
const userId = localStorage.getItem('id'); 
consultaCursosInscrito(userId);

function preencheTelaInscrito(cursos, categorias) {
  cursos.forEach((curso) => {
    // Acesse os dados do curso através da propriedade 'Curso'
    const cursoData = curso.Curso;
    // Verifique se os dados do curso existem
    if (cursoData) {
      // Encontre a categoria correspondente pelo ID
      const categoria = categorias.find((categoria) => categoria.id === cursoData.categoriaId);

      const novoCursoHTML = `
        <div class="card">
          <div class="card-image">
            <img src="/images/cards/${cursoData.image}" width="100%" alt="SGC logo" />
          </div>
          <div class="card-content">
            <h2 class="card-title">${cursoData.name}</h2>
            <p>${cursoData.description}</p>
          </div>
          <div class="card-footer">
            <p class="Categoria">${categoria.name}</p>
            <a href="/pagina-curso/${cursoData.id}">
              <button type="button" class="action">Inscrito</button>
            </a>
          </div>
        </div>
      `;

      cursoIns.innerHTML = cursoIns.innerHTML + novoCursoHTML;
    }
  });
}


