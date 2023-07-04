const DivMostraCurso = document.querySelector("#mostra-curso");
let btnInscrever;

// Pega id enviado pelo backend por cookie
// Função geral para ler qualquer cookie passando algum nome
function read_cookie(name) {
  var result = document.cookie.match(new RegExp(name + "=([^;]+)"));
  result && (result = JSON.parse(result[1]));
  return result;
}

let idCurso = read_cookie("cursoid"); //pegando o cookie
consultaOneCurso(idCurso);

async function consultaOneCurso(id) {
  const responseCurso = await fetch(`http://18.231.150.50:3000/cursos/page/${id}`);
  const curso = await responseCurso.json();

  const responseCategorias = await fetch("http://18.231.150.50:3000/categoria");
  const categorias = await responseCategorias.json();

  // Encontra a categoria correspondente pelo ID
  const categoria = categorias.find((categoria) => categoria.id === curso.categoriaId);

  preencheTelaCurso(curso, categoria);
  console.log(curso);
}


function preencheTelaCurso(curso, categoria) {
  const CursoSelecionado = `
  <div class="curso container">
    <div class="d-flex">
      <img
        src="/images/cards/${curso.image}"
        class="img-fluid align-items-center"
        style="height: 200px"
        alt="SGC logo"
      />
      <div>
        <div class="text-center">
          <h2 class="card-title-curso fw-bolder">${curso.name}</h2>
        </div>
        <div>
          <div class="text-left mx-4">
            <div >
              <span class="card-content-curso-word fw-bolder" >Descrição: </span>
              <span>${curso.description}</span>
            </div>
            <div>
              <span class="card-content-curso-word fw-bolder">Carga Horaria: </span>
              <span>${curso.ch}</span>
            </div>
            <div>
              <span class="card-content-curso-word fw-bolder">Data de Inicio: </span>
              <span>${curso.date_start}</span>
            </div>
            <div>
              <span class="card-content-curso-word fw-bolder">Categoria: </span>
              <span>${categoria.name}</span>
            </div>
          </div>  
        </div>
      </div>
    </div>

    <div class="card-footer-curso">
      <button type="button" class="btn btn-outline-danger mt-3" id="inscrever">Inscrever-se</button>
    </div>
  </div> 
`;
  DivMostraCurso.innerHTML = CursoSelecionado;

  // Adiciona o manipulador de evento ao botão "Inscrever-se"
  btnInscrever = document.querySelector("#inscrever");
  btnInscrever.addEventListener("click", inscreverUsuarioNoCurso);
}

async function inscreverUsuarioNoCurso() {
  // Lógica para criar a relação UserCurso
  // Obtenha o ID do usuário armazenado no Local Storage
  const userId = localStorage.getItem('id'); 
  const cursoId = idCurso; // ID do curso obtido anteriormente pelo cookie
  console.log(cursoId)
  console.log(userId)
  
  // Envie uma solicitação POST para criar a relação UserCurso
  const response = await fetch("http://18.231.150.50:3000/inscrever/user-curso", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      cursoId: cursoId,
    }),
  });
  if (response.ok) {
    // A relação UserCurso foi criada com sucesso
    console.log(idCurso)
    const cursoUpdate = await findCursoById(idCurso);
    let quantInscritosUpdate = cursoUpdate.quantInscritos + 1;
    console.log("Usuário inscrito no curso!");

    // Adiciona a classe ao botão
    btnInscrever.style.background = "grey"; 

    const cursoDto = {
      quantInscritos: quantInscritosUpdate,
    };

    atualizarNumInscritosCurso(idCurso, cursoDto);

    

    // Redirect the user to the login page or any other page
    //window.location.href = '/';
  } else {
     // Houve um erro ao criar a relação UserCurso
    const errorData = await response.json();
    console.error(errorData.error);
  }
}

async function atualizarNumInscritosCurso(id, cursoDto) {
  try {
    const response = await fetch(`http://18.231.150.50:3000/cursos/update/${id}`, { method: 'PUT',
    headers: {
     'Content-Type': 'application/json'
     },
     body: JSON.stringify(cursoDto)},
    );
    if (response.ok) {
      location.reload()
    } else {
      console.error('Erro ao atualizar item');
    }
  } catch (error) {
    console.error('Erro ao fazer requisição', error);
  }
}

async function findCursoById(id) {
  const cursoResponse= await fetch(`http://18.231.150.50:3000/cursos/page/${id}`);
  const curso = await cursoResponse.json();
  console.log("curso")
  return curso;
}

