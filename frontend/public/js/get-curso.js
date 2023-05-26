const DivMostraCurso = document.querySelector("#mostra-curso");

// Pega id enviado pelo backend por cookie
// Função geral para ler qualquer cookie passando algum nome
function read_cookie(name) {
  var result = document.cookie.match(new RegExp(name + "=([^;]+)"));
  result && (result = JSON.parse(result[1]));
  return result;
}

var idCurso = read_cookie("cursoid"); //pegando o cookie
consultaOneCurso(idCurso)

async function consultaOneCurso(id) {
  const response = await fetch(`http://localhost:3000/cursos/page/${id}`);
  const curso = await response.json();
  preencheTelaCurso(curso);
  console.log(curso);
}

function preencheTelaCurso(curso) {
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
          <span
            >${curso.description}</span
          >
        </div>
        <div>
          <span class="card-content-curso-word">Data de Inicio: </span>
          <span>${curso.date_start}</span>
        </div>
        <div>
          <span class="card-content-curso-word">Tags: </span>
          <span>${curso.tags}</span>
        </div>
      </div>

      <div class="card-footer-curso">
        <button type="button" class="action-curso">Inscrever-se</button>
      </div>
    </div>
  `;
  DivMostraCurso.innerHTML = CursoSelecionado;
}

consultaCursos();
