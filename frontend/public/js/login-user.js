const submitBtnLogin = document.querySelector('#logado')

function submitLoginForm(event) {
    event.preventDefault();
  
    const email = document.getElementById('usuario-entrar').value;
    const password = document.getElementById('senha-entrar').value;
  
    const dto = {
      email: email,
      password: password
    };
    console.log(dto)
    sendLoginRequest(dto);
}

async function sendLoginRequest(dto) {
    const response = await fetch('http://18.231.150.50:3000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    });
  
    if (response.ok) {
      // Autenticação bem-sucedida, redirecionar o usuário para a página de perfil
      console.log('Autenticação bem-sucedida');
      
        // Extrair o token da resposta
        const { token } = await response.json();
  
        // Armazenar o token no Local Storage
        localStorage.setItem('token', token);

        // Decodificar o token manualmente para obter o ID do usuário
        const tokenParts = token.split('.');
        const payloadBase64 = tokenParts[1];
        const payload = atob(payloadBase64);
        const { id } = JSON.parse(payload);

        // Armazenar o id no Local Storage
        localStorage.setItem('id', id);
        console.log(localStorage)
        // Chamar a função para obter os dados do usuário
        getUserData(id);
    } else {
      // Autenticação falhou, exibir uma mensagem de erro ou executar outras ações
      console.error('Falha na autenticação');
      window.alert("Email ou Senha incorretos");
    }
}

async function getUserData(id) {
    const token = localStorage.getItem('token'); // Obtenha o token armazenado no Local Storage
  
    const response = await fetch(`http://18.231.150.50:3000/users/login/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Inclua o token no cabeçalho da requisição
      }
    });
  
    if (response.ok) {
      // Os dados do usuário estão na resposta
      const userData = await response.json();
      localStorage.setItem('nameUser', userData.name)
      console.log(userData);
      
      // Use os dados do usuário para preencher a página ou executar outras ações necessárias
      if (userData.role == 'admin' && userData.isAtivo == true) {
        window.location.href = '/root'; // Redirecionar para a tela de root
      }else if (userData.isAtivo == true){
        window.location.href = '/';
      }else{
        window.alert("Seu usuário está desativado");
      }
    } else {
      // Se a chamada falhar, pode ser necessário lidar com o erro adequadamente
      console.error('Falha ao obter os dados do usuário');
    }
  }
  

submitBtnLogin.addEventListener('click', submitLoginForm);