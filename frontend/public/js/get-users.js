const divCursos = document.querySelector("#mostra-users");

async function consultaUsers() {
  const response = await fetch("http://localhost:3000/users", {
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
    <div class="card-curso">
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
  console.log(usuarioDto)
  try {
    const response = await fetch(`http://localhost:3000/users/update/${id}`, { method: 'PUT',
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
  const categoriaObject = await fetch(`http://localhost:3000/users/${id}`);
  const categoria = await categoriaObject.json();
  return categoria;
}

async function logout() {
  try {
    const response = await fetch("http://localhost:3000/users/logout");
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

consultaUsers();
