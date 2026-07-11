window.addEventListener("DOMContentLoaded", function () {
  const startBtn = document.getElementById("start-btn");
  const startScreen = document.getElementById("start-screen");
  const gameScreen = document.getElementById("game-screen");

  const restartBtn = document.getElementById("restart-btn");

restartBtn.addEventListener("click", function () {
  location.reload();
});

  const perguntas = [
  {
    texto: "Você tem tempo livre. O que faz?",
    opcoes: [
      {
        texto: "📚 Estudar",
        efeitos: { conhecimento: 10, energia: -5 }
      },
      {
        texto: "💼 Trabalhar",
        efeitos: { dinheiro: 10, energia: -5 }
      },
      {
        texto: "🎉 Descansar",
        efeitos: { energia: 10 }
      },
      {
        texto: "🙏 Orar",
        efeitos: { fe: 10 }
      }
    ]
  },

  {
    texto: "Uma oportunidade aparece no trabalho. O que faz?",
    opcoes: [
      {
        texto: "Aceitar",
        efeitos: { carreira: 10, dinheiro: 10, energia: -10 }
      },
      {
        texto: "Recusar",
        efeitos: { energia: 5, fe: 5 }
      }
    ]
  },

  {
  texto: "Você recebe um curso caro. O que faz?",
  opcoes: [
    {
      texto: "Investir no curso",
      efeitos: { conhecimento: 15, dinheiro: -10 }
    },
    {
      texto: "Guardar o dinheiro",
      efeitos: { dinheiro: 10 }
    }
  ]
},

{
  texto: "Você está cansado, mas há trabalho por fazer.",
  opcoes: [
    {
      texto: "Continuar a trabalhar",
      efeitos: { dinheiro: 10, energia: -15 }
    },
    {
      texto: "Descansar",
      efeitos: { energia: 15, dinheiro: -5 }
    }
  ]
},

{
  texto: "Surge uma oportunidade duvidosa para ganhar dinheiro.",
  opcoes: [
    {
      texto: "Aceitar",
      efeitos: { dinheiro: 15, fe: -10 }
    },
    {
      texto: "Recusar",
      efeitos: { fe: 10 }
    }
  ]
},

{
  texto: "Alguém precisa da sua ajuda.",
  opcoes: [
    {
      texto: "Ajudar",
      efeitos: { fe: 10, energia: -5 }
    },
    {
      texto: "Ignorar",
      efeitos: { energia: 5 }
    }
  ]
},

{
  texto: "Uma grande oportunidade surge na sua carreira.",
  opcoes: [
    {
      texto: "Aproveitar",
      efeitos: { carreira: 15, energia: -10 }
    },
    {
      texto: "Evitar risco",
      efeitos: { energia: 5 }
    }
  ]
},

];

let estado = {

    carreira: 50,
  dinheiro: 50,
  conhecimento: 50,
  fe: 50,
  energia: 50
};

let perguntaAtual = 0;


function mostrarPergunta() {
  const pergunta = perguntas[perguntaAtual];

  document.getElementById("question").textContent = pergunta.texto;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  pergunta.opcoes.forEach(opcao => {
    const btn = document.createElement("button");

    btn.style.transition = "0.2s";

    btn.textContent = opcao.texto;

    btn.onclick = () => escolherOpcao(opcao.efeitos);

    choicesDiv.appendChild(btn);
  });
}

function escolherOpcao(efeitos) {
  for (let chave in efeitos) {
    estado[chave] += efeitos[chave];

    if (estado[chave] > 100) estado[chave] = 100;
    if (estado[chave] < 0) estado[chave] = 0;

    document.getElementById(chave).textContent = estado[chave];
  }

  perguntaAtual++;

  if (perguntaAtual < perguntas.length) {
    mostrarPergunta();
  } else {
   mostrarFinal();
  }
}

function mostrarFinal() {
  document.getElementById("game-content").style.display = "none";
  document.getElementById("final-screen").style.display = "block";

  let titulo = "";
  let descricao = "";

  if (estado.dinheiro >= 70 && estado.energia >= 60) {
    titulo = "🚀 Sucesso Sustentável";
    descricao = "Você cresceu financeiramente sem sacrificar sua saúde.";
  } 
  else if (estado.dinheiro >= 70 && estado.fe <= 30) {
    titulo = "💰 Sucesso Vazio";
    descricao = "Você ganhou dinheiro, mas perdeu propósito.";
  } 
  else if (estado.fe >= 70 && estado.energia >= 60) {
    titulo = "🙏 Vida com Propósito";
    descricao = "Você construiu uma vida guiada por fé e equilíbrio.";
  } 
  else if (estado.conhecimento >= 70 && estado.dinheiro >= 60) {
    titulo = "🧠 Mente Estratégica";
    descricao = "Seu conhecimento te levou a boas oportunidades.";
  } 
  else if (estado.energia <= 30) {
    titulo = "⚠️ Burnout";
    descricao = "Você ultrapassou seus limites.";
  } 
  else {
    titulo = "🌿 Vida Equilibrada";
    descricao = "Você manteve um equilíbrio razoável entre as áreas.";
  }

  document.getElementById("final-title").textContent = titulo;
  document.getElementById("final-description").textContent = descricao;

  document.getElementById("final-stats").innerHTML = `
    💼 Carreira: ${estado.carreira} <br>
    💰 Dinheiro: ${estado.dinheiro} <br>
    🧠 Conhecimento: ${estado.conhecimento} <br>
    🙏 Fé: ${estado.fe} <br>
    ⚡ Energia: ${estado.energia}
  `;
}


  startBtn.addEventListener("click", function () {
    startScreen.style.display = "none";
    gameScreen.style.display = "block";

    mostrarPergunta();
  });
});