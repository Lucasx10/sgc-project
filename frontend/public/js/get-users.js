const divCursos = document.querySelector("#mostra-users");

//Função para criar um botão para cada curso
function createCursoButton(cursos) {
  
  var button = document.createElement("button");
  button.textContent = "Emitir certificados:  " + cursos.name;
  button.classList.add("btn", "btn-info", "me-1"); // Adiciona as classes do Bootstrap
  button.addEventListener("click", function () {
    emitirCertificados(cursos);
  });

  return button;
}

// Função para adicionar os botões dos cursos na página
function addCursoButtons(cursoIds) {
  var container = document.getElementById("mostra-cursos");
  console.log(cursoIds)
  cursoIds.forEach(function (cursoId) {
    var button = createCursoButton(cursoId);
    container.appendChild(button);
  });
}

// Função para carregar os IDs dos cursos e adicionar os botões na página
async function loadCursoButtons() {
  const response = await fetch("http://18.231.150.50:3000/cursos");
  const cursos = await response.json();

  var cursoIds = cursos.map(curso => {
    return {
      id: curso.id,
      name: curso.name
    };
  }); // Extrair apenas os IDs dos cursos
  
  addCursoButtons(cursoIds);
}

async function consultaUsers() {
  const response = await fetch("http://18.231.150.50:3000/users", {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (response.ok) {
    const users = await response.json();
    // ...
    preencheTela(users)
    // ...
  } else {
    console.error('Você não está autorizado');
  }
}


function preencheTela(users) {
  users.forEach((user) => {
    const novoCursoHTML = `
    <div class="card-curso h-25 mx-2 mt-5">
        <div class="card-content">
        <h2 class="card-title">${user.name}</h2>
        <p>
        ${user.email}
        </p>
        <div class="${user.name}">
            
        </div>
        </div>
        
    </div>
    </div>
    `;
    divCursos.innerHTML = divCursos.innerHTML + novoCursoHTML;
    const button = document.querySelector(`.${user.name}`);
    if(user.role == 'admin'){
      const buttonElement = `
      <button type="button" onclick="ativarDesativarAdmin(${user.id})" class="btn btn-danger">Remover admin</button></a>
      `
      button.innerHTML = button.innerHTML + buttonElement;
     }else{
      const buttonElement = `
      <button type="button" onclick="ativarDesativarAdmin(${user.id})" class="btn btn-primary">Tornar admin</button></a>
      `
      button.innerHTML = button.innerHTML + buttonElement;
    }

    if(user.isAtivo){
      const buttonElement = `
      <button type="button" onclick="ativarDesativarUsuario(${user.id})" class=" btn btn-danger">Desativar usuario</button></a>
      `
      button.innerHTML = button.innerHTML + buttonElement;
     }else{
      const buttonElement = `
      <button type="button" onclick="ativarDesativarUsuario(${user.id})" class="btn btn-primary ">Ativar usuario</button></a>
      `
      button.innerHTML = button.innerHTML + buttonElement;
    }
  });
}

async function ativarDesativarAdmin(id) {
  const user = await findUsuarioById(id);
  let userDto = {}
  if(user.role == 'admin'){
    userDto = {
      role: 'student'
    };
  }else{
    userDto = {
      role: 'admin'
    };
  }
  
  atualizarUsuario(user.id, userDto)
}

async function ativarDesativarUsuario(id) {
  const user = await findUsuarioById(id);
  const userDto = {
    isAtivo: !user.isAtivo
  };
  atualizarUsuario(user.id, userDto)
}

async function atualizarUsuario(id, usuarioDto) {
  try {
    const response = await fetch(`http://18.231.150.50:3000/users/update/${id}`, { method: 'PUT',
    headers: {
     'Content-Type': 'application/json'
     },
     body: JSON.stringify(usuarioDto)},
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

async function findUsuarioById(id) {
  const categoriaObject = await fetch(`http://18.231.150.50:3000/users/${id}`);
  const categoria = await categoriaObject.json();
  return categoria;
}

async function logout() {
  try {
    const response = await fetch("http://18.231.150.50:3000/users/logout");
    if (response.ok) {
      // Redirect the user to the login page or any other page
      window.location.href = '/login';
    } else {
      console.error('Error during logout');
    }
  } catch (error) {
    console.error('Error during logout', error);
  }
}

async function emitirCertificados(cursos) {
  const cursoId = cursos.id; // ID do curso a ser fechado

  // Obtenha todos os usuários inscritos no curso
  const response = await fetch(`http://18.231.150.50:3000/inscrever/fecharCurso/${cursoId}`);
  const usuariosCertificados = await response.json();

  //emite certificado para os usuarios que tem a porcentagem de carga horaria > 90
  usuariosCertificados.forEach((userId) => {
      emitirCertificado(userId);
  });
}

function emitirCertificado(userId) {
  // Lógica para emitir o certificado para o usuário com o ID userId
  // Aqui você pode implementar a lógica específica para emitir o certificado,
  // Exemplo de impressão no console:
  console.log(`Certificado emitido para o usuário com ID ${userId}`);
}

consultaUsers();
loadCursoButtons();