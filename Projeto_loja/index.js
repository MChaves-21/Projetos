let contador = 0;

function anuncio() {
    let tag = document.getElementById('anuncio');

    // Lógica para alternar os textos dependendo do contador
    if (contador === 0) {
        tag.innerHTML = 'Produtos importados';
    } else if (contador === 1) {
        tag.innerHTML = 'Preços imperdíveis';
    } else if (contador === 2) {
        tag.innerHTML = 'Compre agora';
    }

    // Incrementar o contador e resetar após o ciclo completo
    contador = (contador + 1) % 3;  // Isso vai manter o contador entre 0, 1 e 2
}

// Chama a função "anuncio" após 4 segundos (4000 milissegundos) e depois a cada 3 segundos (3000 milissegundos)
setTimeout(function () {
    anuncio(); // Primeira execução após 4 segundos
    setInterval(anuncio, 3000); // Subsequentemente, a cada 3 segundos
}, 4000);

function validarFormulario(event) {
    event.preventDefault();  // Impede o envio do formulário até que a validação seja feita

    // Resetando mensagens de erro
    document.getElementById("nomeError").textContent = '';
    document.getElementById("emailError").textContent = '';

    // Pegando os valores do formulário
    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let dataAniversario = document.getElementById("dataAniversario").value;

    let valid = true;

    // Validando o nome
    if (nome.trim() === '') {
        document.getElementById("nomeError").textContent = "O nome é obrigatório.";
        valid = false;
    }

    // Validando o email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById("emailError").textContent = "Por favor, insira um email válido.";
        valid = false;
    }

    // Se todas as validações forem bem-sucedidas, o formulário pode ser enviado
    if (valid) {
        alert("Cadastro realizado com sucesso!");
        document.getElementById("cadastroForm").reset();  // Reseta o formulário
    } else {
        alert("Por favor, corrija os erros no formulário.");
    }
}

// Adicionando o evento de validação ao formulário
document.getElementById("cadastroForm").addEventListener("submit", validarFormulario);

const modeToggle = document.getElementById('mode-toggle');
const body = document.body;

modeToggle.addEventListener('click', () => {
    // Alterna entre modos claro e escuro
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        modeToggle.textContent = 'nightlight'; // Muda para ícone de lua (noite)
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        modeToggle.textContent = 'wb_sunny'; // Muda para ícone de sol (dia)
    }
});
function trocaImagemEntreUrls1(url1, url2) {
    const imagemElement = document.getElementById('im1');
    let currentImage = url1;
    setInterval(() => {
        currentImage = (currentImage === url1) ? url2 : url1;
        imagemElement.src = currentImage;
    }, 2500);
}

function trocaImagemEntreUrls2(url1, url2) {
    const imagemElement = document.getElementById('im4');
    let currentImage = url1;
    setInterval(() => {
        currentImage = (currentImage === url1) ? url2 : url1;
        imagemElement.src = currentImage;
    }, 2500);
}
function trocaImagemEntreUrls3(url1, url2) {
    const imagemElement = document.getElementById('im6');
    let currentImage = url1;
    setInterval(() => {
        currentImage = (currentImage === url1) ? url2 : url1;
        imagemElement.src = currentImage;
    }, 2500);
}
// Chamando as funções com as URLs específicas
trocaImagemEntreUrls1('img/marron_foto1.jpg', 'img/marron_foto2.jpg');
trocaImagemEntreUrls2('img/bv1.jpg', 'img/bv2.jpg');
trocaImagemEntreUrls3('img/br1.jpg', 'img/br2.jpg')
function trocarImagensDeFundo() {
    const imagens = [
        'img/pexels-anete-lusina-4792084.jpg',
        'img/pexels-karolina-grabowska-6634688.jpg',
        'img/pexels-ron-lach-9850823.jpg'
    ];

    let indice = 0;
    function mudarImagem() {
        const capa = document.getElementById('capa');
        capa.style.backgroundImage = `url(${imagens[indice]})`;
        
        // Atualiza o índice para a próxima imagem
        indice = (indice + 1) % imagens.length;
    }

    // Muda a imagem a cada 4 segundos
    setInterval(mudarImagem, 4000);  // 4000 ms = 4 segundos
}

// Verifica se a largura da tela é maior ou igual a 868px
const mediaQuery = window.matchMedia("(min-width: 868px)");

function verificarTela() {
    if (mediaQuery.matches) {
        // Inicia a troca de imagens se a largura for maior ou igual a 868px
        trocarImagensDeFundo();
    } else {
        // Se a largura for menor, você pode limpar ou desativar a troca de imagens
        clearInterval(mudarImagem);
        document.getElementById('capa').style.backgroundImage = ''; // Limpa a imagem de fundo
    }
}

// Inicializa a verificação
verificarTela();

// Substituindo addListener por addEventListener
mediaQuery.addEventListener('change', verificarTela);
