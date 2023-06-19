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
    console.error('Falha ao obter os usuários');
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
        </div>
        <div class="card-footer">
        <p class="Categoria">${user.isAdmin}</p>
            >
            <button type="button" class="action">Tornar admin</button></a
        >
        </div>
    </div>
    </div>
    `;
    divCursos.innerHTML = divCursos.innerHTML + novoCursoHTML;
  });
}

consultaUsers();
