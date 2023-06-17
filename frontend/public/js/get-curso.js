const DivMostraCurso = document.querySelector("#mostra-curso");

// Pega id enviado pelo backend por cookie
// Função geral para ler qualquer cookie passando algum nome
function read_cookie(name) {
  var result = document.cookie.match(new RegExp(name + "=([^;]+)"));
  result && (result = JSON.parse(result[1]));
  return result;
}

var idCurso = read_cookie("cursoid"); //pegando o cookie
consultaOneCurso(idCurso);

async function consultaOneCurso(id) {
  const responseCurso = await fetch(`http://localhost:3000/cursos/page/${id}`);
  const curso = await responseCurso.json();

  const responseCategorias = await fetch("http://localhost:3000/categoria");
  const categorias = await responseCategorias.json();

  // Encontra a categoria correspondente pelo ID
  const categoria = categorias.find((categoria) => categoria.id === curso.categoriaId);

  preencheTelaCurso(curso, categoria);
  console.log(curso);
}

function preencheTelaCurso(curso, categoria) {
  const CursoSelecionado = `
    <div class="card-curso">
      <div class="card-image-curso">
        <img
          src="/images/cards/${curso.image}"
          width="100%"
          alt="SGC logo"
        />
      </div>
      <div class="card-content-curso">
        <h2 class="card-title-curso">${curso.name}</h2>
        <div>
          <span class="card-content-curso-word">Descrição: </span>
          <span>${curso.description}</span>
        </div>
        <div>
          <span class="card-content-curso-word">Carga Horaria: </span>
          <span>${curso.ch}</span>
        </div>
        <div>
          <span class="card-content-curso-word">Data de Inicio: </span>
          <span>${curso.date_start}</span>
        </div>
        <div>
          <span class="card-content-curso-word">Categoria: </span>
          <span>${categoria.name}</span>
        </div>
      </div>

      <div class="card-footer-curso">
        <button type="button" class="action-curso">Inscrever-se</button>
      </div>
    </div>
  `;
  DivMostraCurso.innerHTML = CursoSelecionado;
}

consultaOneCurso(idCurso);
