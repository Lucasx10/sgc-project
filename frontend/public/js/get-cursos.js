const divCursos = document.querySelector("#cursos");

async function consultaCursos() {
  const response = await fetch("http://localhost:3000/cursos");
  const cursos = await response.json();
  preencheTela(cursos);
}

const divPageCurso = document.querySelector("#inscrever");

async function consultaCurso(id) {
  const response = await fetch(`http://localhost:3000/cursos/page/${id}`);
  const curso = await response.json();

  return curso[0]
}

function preencheTela(cursos) {
  divCursos.innerHTML = "";
  cursos.forEach((curso) => {
    const novoCursoHTML = `
    <div id="curso${curso.id}" class="card">
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
        <p class="tag">${curso.tags}</p>
        <button type="button" class="action" onclick="preencheTelaCurso(${curso.id})">Inscrever-se</button>
      </div>
    </div>
    `;
    divCursos.innerHTML = divCursos.innerHTML + novoCursoHTML;
  });
}


async function preencheTelaCurso(id) {
    const curso = await consultaCurso(id);
    const cursoParaMostrar = document.querySelector(`#curso${id}`);  

    const novoCursoHTML = `
    <div class="card-curso">
    <div class="card-image-curso">
      <img
        src="images/cards/${curso.image}"
        width="100%"
        alt="SGC logo"
      />
    </div>
    <div class="card-content-curso">
      <h2 class="card-title-curso">${curso.name}</h2>
      <div>
        <span class="card-content-curso-word">Descição: </span>
        <span>${curso.description}</span
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
      cursoParaMostrar.innerHTML = novoCursoHTML;
    preencheTelaCurso(cursoParaMostrar)
}

consultaCursos();

