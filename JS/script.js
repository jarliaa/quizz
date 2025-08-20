import { aleatorio, nome } from './aleatorio.js';
import { perguntas } from './perguntas.js';

const caixaPrincipal = document.querySelector(".caixa-principal");
const caixaPerguntas = document.querySelector(".caixa-perguntas");
const caixaAlternativas = document.querySelector(".caixa-alternativas");
const caixaResultado = document.querySelector(".caixa-resultado");
const textoResultado = document.querySelector(".texto-resultado");
const botaoJogarNovamente = document.querySelector(".novamente-btn");
const botaoIniciar = document.querySelector(".iniciar-btn");
const telaInicial = document.querySelector(".tela-inicial");

let atual = 0;
let historiaFinal = "";

/** Substitui "você" por nome (case-insensitive) */
function substituiNome() {
  const re = /você/gi;
  for (const pergunta of perguntas) {
    if (pergunta.enunciado) {
      pergunta.enunciado = pergunta.enunciado.replace(re, nome);
    }
    if (Array.isArray(pergunta.alternativas)) {
      pergunta.alternativas.forEach(alt => {
        if (alt.texto) alt.texto = alt.texto.replace(re, nome);
        if (Array.isArray(alt.afirmacao)) {
          alt.afirmacao = alt.afirmacao.map(a => a.replace(re, nome));
        }
      });
    }
  }
}

function escondeTudo() {
  if (telaInicial) telaInicial.style.display = "none";
  if (caixaPerguntas) caixaPerguntas.style.display = "none";
  if (caixaAlternativas) caixaAlternativas.style.display = "none";
  if (caixaResultado) caixaResultado.style.display = "none";
}

function mostraTelaInicial() {
  escondeTudo();
  if (telaInicial) telaInicial.style.display = "block";
}

function iniciaJogo() {
  atual = 0;
  historiaFinal = "";
  escondeTudo();
  if (caixaPerguntas) caixaPerguntas.style.display = "block";
  if (caixaAlternativas) {
    caixaAlternativas.style.display = "flex";
    caixaAlternativas.innerHTML = "";
  }
  mostraPergunta();
}

function mostraPergunta() {
  const pergunta = perguntas[atual];
  if (!pergunta) {
    mostraResultado();
    return;
  }

  // Renderiza enunciado
  if (caixaPerguntas) {
    caixaPerguntas.innerHTML = `<h2 class="texto-pergunta">${pergunta.enunciado}</h2>`;
  }

  // Renderiza alternativas
  if (caixaAlternativas) {
    caixaAlternativas.innerHTML = "";
    pergunta.alternativas.forEach((alt) => {
      const btn = document.createElement("button");
      btn.className = "btn-alternativa";
      btn.textContent = alt.texto;
      btn.addEventListener("click", () => respostaSelecionada(alt));
      caixaAlternativas.appendChild(btn);
    });
  }
}

function respostaSelecionada(alt) {
  // Acumula a primeira frase de "afirmacao", se existir
  if (Array.isArray(alt.afirmacao) && alt.afirmacao[0]) {
    if (historiaFinal) historiaFinal += " ";
    historiaFinal += alt.afirmacao[0];
  }

  // Vai para a próxima pergunta, se definida; senão, mostra resultado
  if (alt.proxima !== null && alt.proxima !== undefined && perguntas[alt.proxima]) {
    atual = alt.proxima;
    mostraPergunta();
  } else {
    mostraResultado();
  }
}

function mostraResultado() {
  if (caixaPerguntas) caixaPerguntas.style.display = "none";
  if (caixaAlternativas) {
    caixaAlternativas.style.display = "none";
    caixaAlternativas.innerHTML = "";
  }
  if (caixaResultado) caixaResultado.style.display = "block";
  if (textoResultado) textoResultado.textContent = historiaFinal || "Fim!";
}

function jogaNovamente() {
  mostraTelaInicial();
}

// Listeners
if (botaoIniciar) botaoIniciar.addEventListener("click", iniciaJogo);
if (botaoJogarNovamente) botaoJogarNovamente.addEventListener("click", jogaNovamente);

// Inicialização
substituiNome();
mostraTelaInicial();
