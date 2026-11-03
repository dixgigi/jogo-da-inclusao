import {
    salvarPontuacao,
    acompanharRanking,
    modoCompartilhado,
    definirLiberacao,
    acompanharLiberacao,
    CODIGO_ADMIN
} from "./firebase.js";


// ======================================
// PERGUNTAS DO JOGO
// ======================================

const perguntas = [

    {
        cat: "SOBRECARGA SENSORIAL",
        titulo: "E se fosse com você?",
        texto: "Durante uma atividade, a sala fica muito barulhenta. Um aluno autista cobre os ouvidos e demonstra desconforto. O que fazer?",
        op: [
            "Dizer para parar e continuar como os outros.",
            "Reconhecer o desconforto, reduzir os estímulos e oferecer apoio.",
            "Ignorar para não chamar atenção."
        ],
        c: 1,
        exp: "O barulho pode causar sobrecarga sensorial. Acolher, respeitar os sinais e reduzir o desconforto é mais adequado do que julgar.",
        frase: "COMPREENDER É O PRIMEIRO PASSO PARA INCLUIR."
    },

    {
        cat: "SHUTDOWN",
        titulo: "Você percebeu os sinais?",
        texto: "Um estudante fica muito quieto, evita interações e parece não conseguir responder. Qual atitude demonstra compreensão?",
        op: [
            "Insistir para que fale imediatamente.",
            "Concluir que está sendo mal-educado.",
            "Dar espaço, observar os sinais e oferecer apoio com tranquilidade."
        ],
        c: 2,
        exp: "Nem todo sofrimento é visível. Um shutdown pode envolver retraimento e dificuldade de responder. Pressionar pode aumentar o desconforto.",
        frase: "NEM TODO SOFRIMENTO É VISÍVEL."
    },

    {
        cat: "TECNOLOGIA E INCLUSÃO",
        titulo: "Tecnologia ou inclusão?",
        texto: "A escola usa um aplicativo para ajudar o aluno a comunicar necessidades. Qual afirmação está correta?",
        op: [
            "A tecnologia apoia a comunicação, mas não substitui o cuidado humano.",
            "Com o aplicativo, o mediador deixa de ser necessário.",
            "A tecnologia deve decidir sozinha o que o aluno precisa."
        ],
        c: 0,
        exp: "A tecnologia é uma ferramenta de apoio e deve trabalhar junto com professores, mediadores, família e o próprio aluno.",
        frase: "A TECNOLOGIA NÃO SUBSTITUI O CUIDADO. ELA PODE AMPLIÁ-LO."
    },

    {
        cat: "INCLUSÃO NA PRÁTICA",
        titulo: "Incluir é mais do que aceitar?",
        texto: "Dois alunos precisam de formas diferentes de participar. O que significa agir com inclusão?",
        op: [
            "Oferecer exatamente o mesmo recurso.",
            "Adaptar recursos e apoio para que cada um possa participar.",
            "Retirar da atividade quem precisar de adaptação."
        ],
        c: 1,
        exp: "Incluir não significa tratar todos de forma idêntica, mas oferecer condições justas para que todos participem.",
        frase: "IGUALDADE NÃO É IGNORAR AS DIFERENÇAS."
    },

    {
        cat: "COMUNICAÇÃO",
        titulo: "E quando a fala não vem?",
        texto: "Um aluno aponta para uma imagem no tablet para mostrar que precisa de uma pausa. Como reagir?",
        op: [
            "Aceitar a comunicação e ajudá-lo a fazer a pausa combinada.",
            "Exigir que diga a frase em voz alta.",
            "Retirar o tablet para incentivar a fala."
        ],
        c: 0,
        exp: "A comunicação pode acontecer de diferentes maneiras. Recursos visuais e comunicação alternativa também permitem expressar necessidades.",
        frase: "TODA FORMA DE COMUNICAÇÃO MERECE SER OUVIDA."
    },

    {
        cat: "ROTINA",
        titulo: "Uma mudança inesperada",
        texto: "A aula no pátio foi transferida para a sala e o aluno demonstra ansiedade. O que pode ajudar?",
        op: [
            "Dizer que precisa aceitar sem explicações.",
            "Explicar a mudança com calma e mostrar a nova sequência da rotina.",
            "Fingir que nada mudou."
        ],
        c: 1,
        exp: "Antecipar mudanças com linguagem clara, imagens ou sequência visual pode tornar a transição mais compreensível.",
        frase: "PREVISIBILIDADE TAMBÉM É ACOLHIMENTO."
    },

    {
        cat: "AUTORREGULAÇÃO",
        titulo: "Uma pausa pode ajudar?",
        texto: "Durante a atividade, o aluno demonstra estresse e pede para ir a um local tranquilo. Qual a melhor atitude?",
        op: [
            "Permitir a pausa combinada e respeitar o tempo para se reorganizar.",
            "Obrigá-lo a terminar antes de sair.",
            "Interpretar o pedido como falta de interesse."
        ],
        c: 0,
        exp: "Uma pausa planejada pode ajudar na autorregulação. É importante combinar estratégias seguras e respeitar os sinais do aluno.",
        frase: "ACOLHER É TAMBÉM RESPEITAR LIMITES."
    },

    {
        cat: "PARCERIA COM A FAMÍLIA",
        titulo: "A escola não está sozinha",
        texto: "Uma estratégia usada em sala não está ajudando. Qual caminho fortalece a inclusão?",
        op: [
            "Manter tudo igual.",
            "Conversar com a família e os profissionais para ajustar o apoio.",
            "Responsabilizar somente a família."
        ],
        c: 1,
        exp: "A parceria entre escola, família e profissionais ajuda a construir estratégias coerentes, respeitosas e centradas nas necessidades do aluno.",
        frase: "INCLUSÃO SE CONSTRÓI EM PARCERIA."
    }

];


// ======================================
// VARIÁVEIS DO JOGO
// ======================================

const $ = id => document.getElementById(id);

let nome = "";
let i = 0;
let pontos = 0;
let bloqueada = false;
let liberado = false;
let admin = false;

let iniciado =
    localStorage.getItem("tia_participacao_iniciada") === "true";

let concluido =
    localStorage.getItem("tia_participacao_concluida") === "true";


// ======================================
// CONTROLE DE TELAS
// ======================================

function tela(id) {

    [
        "tela-inicio",
        "tela-admin",
        "tela-jogo",
        "tela-final",
        "tela-ranking"
    ].forEach(x => {
        $(x).classList.add("escondido");
    });

    $(id).classList.remove("escondido");

}


// ======================================
// ATUALIZAR TELA INICIAL
// ======================================

function atualizarInicio() {

    const usado = iniciado || concluido;

    $("btn-iniciar").disabled = usado || !liberado;

    $("btn-iniciar").textContent = usado
        ? "Participação já utilizada"
        : liberado
            ? "Começar desafio"
            : "Aguardando liberação do ADM";

    $("aviso-bloqueio").textContent = concluido
        ? "Sua participação já foi concluída neste aparelho."
        : iniciado
            ? "Este aparelho já iniciou uma participação."
            : liberado
                ? "O ADM liberou o início. Você já pode começar!"
                : "Aguardando a autorização do administrador para iniciar.";

}


// ======================================
// INICIAR JOGO
// ======================================

function iniciar() {

    if (!liberado || iniciado || concluido) {
        return alert("O jogo ainda não foi liberado ou este aparelho já participou.");
    }

    if (!$("nome").value.trim()) {
        return alert("Digite seu nome para começar.");
    }

    nome = $("nome").value.trim();

    localStorage.setItem("tia_participacao_iniciada", "true");

    iniciado = true;
    i = 0;
    pontos = 0;

    tela("tela-jogo");

    carregar();
    atualizarInicio();

}


// ======================================
// CARREGAR PERGUNTAS
// ======================================

function carregar() {

    bloqueada = false;

    const q = perguntas[i];

    $("progresso").textContent =
        `PERGUNTA ${i + 1} DE ${perguntas.length}`;

    $("pontuacao").textContent =
        `${pontos} PONTOS`;

    $("barra-progresso").style.width =
        `${(i + 1) / perguntas.length * 100}%`;

    $("categoria").textContent = q.cat;

    $("pergunta-titulo").textContent = q.titulo;

    $("pergunta-texto").textContent = q.texto;

    $("opcoes").innerHTML = "";

    $("reflexao").classList.add("escondido");

    q.op.forEach((txt, n) => {

        const b = document.createElement("button");

        b.className = "opcao";

        const l = document.createElement("b");

        l.className = "letra";

        l.textContent = String.fromCharCode(65 + n) + ".";

        const s = document.createElement("span");

        s.textContent = txt;

        b.append(l, s);

        b.onclick = () => responder(n);

        $("opcoes").append(b);

    });

}


// ======================================
// RESPONDER PERGUNTAS
// ======================================

function responder(n) {

    if (bloqueada) return;

    bloqueada = true;

    const q = perguntas[i];

    const certo = n === q.c;

    if (certo) {
        pontos += 100;
    }

    [...$("opcoes").children].forEach((b, k) => {

        b.disabled = true;

        if (k === q.c) {
            b.classList.add("correta");
        }

        if (k === n && !certo) {
            b.classList.add("escolhida-errada");
        }

    });

    $("pontuacao").textContent = `${pontos} PONTOS`;

    $("resultado-titulo").textContent =
        certo ? "Boa escolha!" : "Vamos refletir juntos";

    $("resultado-texto").textContent = q.exp;

    $("frase-chave").textContent = q.frase;

    $("btn-proxima").textContent =
        i === perguntas.length - 1
            ? "Ver resultado"
            : "Próxima situação";

    $("reflexao").classList.remove("escondido");

}


// ======================================
// PRÓXIMA PERGUNTA E RESULTADO FINAL
// ======================================

function proxima() {

    if (++i < perguntas.length) {
        return carregar();
    }

    concluido = true;

    localStorage.setItem("tia_participacao_concluida", "true");

    $("pontos-finais").textContent = pontos;

    $("mensagem-final").textContent =
        `${nome}, você concluiu as oito situações. Leve essas reflexões para atitudes reais de respeito e inclusão.`;

    $("status-salvar").textContent = "";

    $("btn-salvar").disabled = false;

    $("btn-salvar").textContent = "Salvar no ranking";

    tela("tela-final");

    atualizarInicio();

}


// ======================================
// SALVAR PONTUAÇÃO
// ======================================

async function salvar() {

    $("btn-salvar").disabled = true;

    $("status-salvar").textContent = "Salvando...";

    try {

        await salvarPontuacao(nome, pontos);

        $("status-salvar").textContent = modoCompartilhado
            ? "Pontuação salva no ranking compartilhado!"
            : "Salva apenas neste navegador. Configure Firebase para compartilhar.";

        $("btn-salvar").textContent = "Pontuação salva";

    } catch (e) {

        console.error(e);

        $("status-salvar").textContent =
            "Falha ao salvar. Confira a configuração do Firebase.";

        $("btn-salvar").disabled = false;

    }

}


// ======================================
// RANKING
// ======================================

function ranking() {

    tela("tela-ranking");

    $("status-ranking").textContent = modoCompartilhado
        ? "Ranking compartilhado."
        : "Ranking local deste navegador.";

    acompanharRanking(lista => {

        $("lista-ranking").innerHTML = "";

        if (!lista.length) {

            $("lista-ranking").innerHTML =
                "<li>Nenhuma pontuação registrada.</li>";

            return;
        }

        lista.slice(0, 10).forEach((x, n) => {

            const li = document.createElement("li");

            li.textContent = `${n + 1}º — ${x.nome}`;

            const s = document.createElement("span");

            s.textContent = x.pontos + " pts";

            li.append(s);

            $("lista-ranking").append(li);

        });

    });

}


// ======================================
// PAINEL DO ADMINISTRADOR
// ======================================

function painelAdmin() {

    $("erro-admin").textContent = "";

    $("admin-login").classList.remove("escondido");

    $("admin-controles").classList.add("escondido");

    $("senha-admin").value = "";

    tela("tela-admin");

}


// ======================================
// ENTRAR COMO ADMINISTRADOR
// ======================================

function entrarAdmin() {

    if ($("senha-admin").value !== CODIGO_ADMIN) {

        $("erro-admin").textContent = "Código incorreto.";

        return;
    }

    admin = true;

    $("admin-login").classList.add("escondido");

    $("admin-controles").classList.remove("escondido");

    statusAdmin();

}


// ======================================
// STATUS DO JOGO
// ======================================

function statusAdmin() {

    $("status-sessao").textContent = liberado
        ? "STATUS: JOGO LIBERADO"
        : "STATUS: JOGO BLOQUEADO";

}


// ======================================
// LIBERAR OU BLOQUEAR O JOGO
// ======================================

async function liberar(v) {

    if (!admin) return;

    try {

        await definirLiberacao(v);

        liberado = v;

        atualizarInicio();

        statusAdmin();

    } catch (e) {

        $("erro-admin").textContent =
            "Não foi possível alterar. Confira o Firebase.";

    }

}


// ======================================
// EVENTOS DOS BOTÕES
// ======================================

$("btn-iniciar").onclick = iniciar;

$("nome").addEventListener("keydown", e => {

    if (e.key === "Enter") iniciar();

});

$("btn-proxima").onclick = proxima;

$("btn-salvar").onclick = salvar;

$("btn-ver-ranking").onclick = ranking;

$("btn-ranking-inicio").onclick = ranking;

$("btn-voltar").onclick = () => tela("tela-inicio");

$("btn-admin").onclick = painelAdmin;

$("btn-entrar-admin").onclick = entrarAdmin;

$("senha-admin").addEventListener("keydown", e => {

    if (e.key === "Enter") entrarAdmin();

});

$("btn-liberar").onclick = () => liberar(true);

$("btn-bloquear").onclick = () => liberar(false);

$("btn-sair-admin").onclick = () => {

    admin = false;

    tela("tela-inicio");

};


// ======================================
// ACOMPANHAR LIBERAÇÃO DO ADMINISTRADOR
// ======================================

acompanharLiberacao(v => {

    liberado = v;

    atualizarInicio();

    if (admin) {
        statusAdmin();
    }

});


// ======================================
// INICIALIZAÇÃO
// ======================================

atualizarInicio();
