const divCursos = document.querySelector("#cursos");

async function consultaCursos() {
  const response = await fetch("http://localhost:3000/cursos");
  const cursos = await response.json();
  preencheTela(cursos);
}

function preencheTela(cursos) {
  cursos.forEach((curso) => {
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
      <p class="tag">${curso.categoriaId}</p>
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
