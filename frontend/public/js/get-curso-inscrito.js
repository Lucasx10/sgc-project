let btnCertificado = document.querySelector("#certificado");
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const progressBar = document.querySelector("#progress-bar");
const progressText = document.querySelector("#progress-text");
// Obtenha o ID do usuário armazenado no Local Storage
let userId = sessionStorage.getItem('id');

// Pega id enviado pelo backend por cookie
// Função geral para ler qualquer cookie passando algum nome
function read_cookie(name) {
  var result = document.cookie.match(new RegExp(name + "=([^;]+)"));
  result && (result = JSON.parse(result[1]));
  return result;
}


checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      atualizarCargaHoraria();
    });
  });
  
  function atualizarCargaHoraria() {
    let cargaHorariaTotal = checkboxes.length * 10; // Supondo que cada módulo tenha uma carga horária de 10 horas
    let cargaHorariaConcluida = 0;
  
    checkboxes.forEach(function(checkbox) {
      if (checkbox.checked) {
        cargaHorariaConcluida += 10; // Supondo que cada módulo tenha uma carga horária de 10 horas
      }
    });
  
    console.log('Carga horária total: ' + cargaHorariaConcluida + ' horas');
  
     // Calcula o percentual de conclusão do curso
     const percentualConcluido = (cargaHorariaConcluida / cargaHorariaTotal) * 100;
     console.log('Percentual concluído: ' + percentualConcluido + '%');
   
     // Atualiza a barra de progresso e o texto
     progressBar.value = percentualConcluido;
     progressText.textContent = percentualConcluido.toFixed(2) + '%';
  
    // Chamada para enviar a carga horária atualizada para o servidor
    enviarCargaHorariaAtualizada(percentualConcluido);
  }
  
  async function enviarCargaHorariaAtualizada(porcentagemConcluida) {
    const cursoId = idCurso; // ID do curso obtido anteriormente pelo cookie
  
    // Envie uma solicitação POST para atualizar a carga horária do curso
    const response = await fetch("http://18.231.150.50:3000/inscrever/cargaHoraria", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        cursoId: cursoId,
        porcentagemConcluida: porcentagemConcluida,
      }),
    });
  
    if (response.ok) {
      // A carga horária foi atualizada com sucesso
      console.log("Carga horária atualizada!");
  
      // Adicione a lógica para o administrador verificar os usuários com mais de 90% de conclusão do curso e emitir certificados para eles
    } else {
      // Houve um erro ao atualizar a carga horária
      const errorData = await response.json();
      console.error(errorData.error);
    }
  }

let idCurso = read_cookie("cursoid"); //pegando o cookie
consultaOneCurso(idCurso);

async function consultaOneCurso(cursoId)  {
    const responseCurso = await fetch(`http://18.231.150.50:3000/cursos/page/${cursoId}`);
    const curso = await responseCurso.json();
    // Verifica se a coluna IsCertificateReady é true para a inscrição desse usuário nesse curso
    const responseInscricao = await fetch(`http://18.231.150.50:3000/inscrever/isCertificateReady/${userId}/${cursoId}`);
    const inscricao = await responseInscricao.json();

    const IsCertificateReady = inscricao

    if(IsCertificateReady == true) {
        // Exibir a parte de perfil e o link de logout
        document.getElementById('exibir-certificado').style.display = 'block';
        btnCertificado.addEventListener("click", emitirCertificado.bind(null, curso));
    } else {
        document.getElementById('exibir-certificado').style.display = 'none';
    }
}
  
  function emitirCertificado(curso) {
    const usuario = sessionStorage.getItem('nameUser'); // Obtenha as informações do usuário atual
  
    const certificado = {
      nome: usuario,
      curso: curso.name,
      cargaHoraria: curso.ch
    };
  
    // Função auxiliar para criar um objeto de estilo com a propriedade bold
    function createBoldStyle() {
      return {
        bold: true
      };
    }
  
    // Gere o documento PDF com o certificado
    const docDefinition = {
      content: [
        { text: 'Certificado', style: 'header' },
        {
          text: [
            'Confere o presente ',
            { text: 'Certificado de Aperfeiçoamento/Especialização', style: 'subheader' },
            ' a ',
            { text: `${certificado.nome}`, style: 'destaque' }
          ],
          style: 'subheader'
        },
        {
          text: [
            'Por haver concluído o Curso de ',
            { text: `${certificado.curso}`, style: 'destaque' },
            ' com duração de'
          ],
          style: 'subheader'
        },
        {
          text: [
            'Carga Horária: ',
            { text: `${certificado.cargaHoraria} horas`, style: 'destaque' }
          ],
          style: 'subheader'
        }
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          italics: true,
          margin: [0, 100],
          alignment: 'center' // Centraliza o texto
        },
        destaque: {
            fontSize: 18,
            alignment: 'center', // Centraliza o texto
            bold: true
        },
        subheader: {
          fontSize: 18,
          alignment: 'center' // Centraliza o texto
        }
      },
      pageOrientation: 'landscape' // Define a orientação da página como paisagem
    };
  
    pdfMake.createPdf(docDefinition).open();
  }