const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const palavraChave = "importante";

const funcoes = {
    ObservacaoCriada: (observacao) => {
        observacao.status = observacao.texto.includes(palavraChave) ? "importante" : "comum";
        axios.post("http://localhost:10000/eventos", {
            tipo: "ObservacaoClassificada",
            dados: observacao
        });
    },
    LembreteCriado: (lembrete) => {
        console.log(lembrete);
    },
    ObservacaoAtualizada: (observacao) => {
        console.log(observacao);
    },
    ObservacaoClassificada: (observacao) => {
        console.log(observacao);
    }
};

app.post("/eventos", (req, res) => {
    console.log("Classificação: " + req.body.tipo);
    funcoes[req.body.tipo](req.body.dados);
    res.send({ msg: 'ok' });
});

app.listen(7000, () => console.log("Classificação. Porta 7000."));

