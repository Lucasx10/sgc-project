const divCursos = document.querySelector("#cursos");
const cursoIns = document.querySelector("#cursos-inscrito");

async function consultaCursos() {
  const response = await fetch("http://18.231.150.50:3000/cursos");
  const cursos = await response.json();

  const responseCategorias = await fetch("http://18.231.150.50:3000/categoria");
  const categorias = await responseCategorias.json();

  preencheTela(cursos, categorias);
}

async function consultaCursosInscrito(userId) {
  const response = await fetch(`http://18.231.150.50:3000/inscrever/${userId}/cursos`);
  const userCursos  = await response.json();

  const responseCategorias = await fetch("http://18.231.150.50:3000/categoria");
  const categorias = await responseCategorias.json();

  preencheTelaInscrito(userCursos, categorias);
  console.log(userCursos)
}

function preencheTela(cursos, categorias) {
  cursos.forEach((curso) => {
    // Encontra a categoria correspondente pelo ID
    const categoria = categorias.find((categoria) => categoria.id === curso.categoriaId);

    const novoCursoHTML = `
    <div class="cursos card">
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
        <button type="button" class="btn btn-outline-danger">Inscrever-se</button></a
      >
    </div>
  </div>
    `;
    divCursos.innerHTML = divCursos.innerHTML + novoCursoHTML;
  });
}

consultaCursos();

function preencheTelaInscrito(cursos, categorias) {
  cursos.forEach((curso) => {
    // Acesse os dados do curso através da propriedade 'Curso'
    const cursoData = curso.Curso;
    // Verifique se os dados do curso existem
    if (cursoData) {
      // Encontre a categoria correspondente pelo ID
      const categoria = categorias.find((categoria) => categoria.id === cursoData.categoriaId);

      const novoCursoHTML = `
        <div class="cursos card">
          <div class="card-image">
            <img src="/images/cards/${cursoData.image}" width="100%" alt="SGC logo" />
          </div>
          <div class="card-content">
            <h2 class="card-title">${cursoData.name}</h2>
            <p>${cursoData.description}</p>
          </div>
          <div class="card-footer">
            <p class="Categoria">${categoria.name}</p>
            <a href="/pagina-curso-inscrito/${cursoData.id}">
              <button type="button" class="btn btn-outline-success">Inscrito</button>
            </a>
          </div>
        </div>
      `;

      cursoIns.innerHTML = cursoIns.innerHTML + novoCursoHTML;
    }
  });
}


  // Verificar se há um token válido no Local Storage
  const token = localStorage.getItem('token');

  if (token) {
    // Exibir a parte de perfil e o link de logout
    document.getElementById('perfil-link').style.display = 'block';
    document.getElementById('logout-link').style.display = 'block';
    // Obtenha o ID do usuário armazenado no Local Storage
    const userId = localStorage.getItem('id'); 
    consultaCursosInscrito(userId);
    document.getElementById('exibir-cursos-inscrito').style.display = 'block';
    // Ocultar o link de login
    document.getElementById('login-link').style.display = 'none';
  } else {
    // Ocultar a parte de perfil e o link de logout
    document.getElementById('perfil-link').style.display = 'none';
    document.getElementById('logout-link').style.display = 'none';
    document.getElementById('exibir-cursos-inscrito').style.display = 'none';
    // Exibir o link de login
    document.getElementById('login-link').style.display = 'block';
  }

// Função para fazer logout
function logout() {
  // Remover o token do Local Storage
  localStorage.removeItem('token');
  localStorage.removeItem('id');

}