// ======================================
// CONFIGURAÇÃO DO FIREBASE
// ======================================

// Para autorização e ranking compartilhados entre celulares,
// configure o Firebase abaixo.

// O PIN é uma trava simples de demonstração.
// NÃO é uma autenticação segura.

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    set,
    onValue,
    query,
    orderByChild,
    limitToLast,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ======================================
// CÓDIGO DO ADMINISTRADOR
// ======================================

export const CODIGO_ADMIN = "2468"; // TROQUE ESTE CÓDIGO.


// ======================================
// DADOS DO PROJETO FIREBASE
// ======================================

const firebaseConfig = {

    apiKey: "",

    authDomain: "",

    databaseURL: "",

    projectId: "",

    storageBucket: "",

    messagingSenderId: "",

    appId: ""

};


// ======================================
// INICIALIZAÇÃO
// ======================================

const configurado = Object.values(firebaseConfig)
    .every(v => v.trim() !== "");

let db = null;

if (configurado) {

    db = getDatabase(
        initializeApp(firebaseConfig)
    );

}

export const modoCompartilhado = !!db;


// ======================================
// OBTER AUTORIZAÇÃO DO JOGO
// ======================================

export async function obterLiberacao() {

    if (!db) {

        return localStorage.getItem("tia_jogo_liberado") === "true";

    }

    const s = await get(
        ref(db, "config/jogoLiberado")
    );

    return s.val() === true;

}


// ======================================
// LIBERAR OU BLOQUEAR O JOGO
// ======================================

export async function definirLiberacao(v) {

    if (!db) {

        localStorage.setItem(
            "tia_jogo_liberado",
            String(v)
        );

        window.dispatchEvent(
            new Event("tia-liberacao-alterada")
        );

        return;

    }

    await set(
        ref(db, "config/jogoLiberado"),
        !!v
    );

}


// ======================================
// ACOMPANHAR AUTORIZAÇÃO EM TEMPO REAL
// ======================================

export function acompanharLiberacao(cb) {

    if (!db) {

        const f = () => {

            cb(
                localStorage.getItem("tia_jogo_liberado") === "true"
            );

        };

        f();

        window.addEventListener(
            "tia-liberacao-alterada",
            f
        );

        window.addEventListener(
            "storage",
            f
        );

        return () => {

            window.removeEventListener(
                "tia-liberacao-alterada",
                f
            );

            window.removeEventListener(
                "storage",
                f
            );

        };

    }

    return onValue(
        ref(db, "config/jogoLiberado"),
        s => cb(s.val() === true)
    );

}


// ======================================
// SALVAR PONTUAÇÃO
// ======================================

export async function salvarPontuacao(nome, pontos) {

    if (!db) {

        const a = JSON.parse(
            localStorage.getItem("rankingTIA") || "[]"
        );

        a.push({

            nome,

            pontos,

            data: Date.now()

        });

        a.sort((x, y) => y.pontos - x.pontos);

        localStorage.setItem(
            "rankingTIA",
            JSON.stringify(a.slice(0, 100))
        );

        return;

    }

    await set(
        push(ref(db, "ranking")),
        {

            nome,

            pontos,

            data: Date.now()

        }
    );

}


// ======================================
// ACOMPANHAR RANKING
// ======================================

export function acompanharRanking(cb) {

    if (!db) {

        const a = JSON.parse(
            localStorage.getItem("rankingTIA") || "[]"
        );

        cb(
            a.sort((x, y) => y.pontos - x.pontos)
        );

        return () => {};

    }

    return onValue(

        query(
            ref(db, "ranking"),
            orderByChild("pontos"),
            limitToLast(100)
        ),

        s => {

            const a = [];

            s.forEach(x => {

                a.push(x.val());

            });

            a.sort((x, y) => y.pontos - x.pontos);

            cb(a);

        }

    );

}
