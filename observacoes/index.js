const express = require('express');
const axios = require('axios');
const app = express();
const { v4: uuidv4 } = require('uuid');
app.use(express.json());

const observacoesPorLembreteId = {};

const funcoes = {
    ObservacaoClassificada: (observacao) => {
        const observacoes = observacoesPorLembreteId[observacao.lembreteId];
        const obsParaAtualizar = observacoes.find(o => o.id === observacao.id);
        obsParaAtualizar.status = observacao.status;
        axios.post("http://localhost:10000/eventos", {
            tipo: "ObservacaoAtualizada",
            dados: {
                id: observacao.id,
                texto: observacao.texto,
                lembreteId: observacao.lembreteId,
                status: observacao.status
            }
        });
    },
    LembreteCriado: (lembrete) => {
        console.log(lembrete);
    },
    ObservacaoCriada: (observacao) => {
        console.log(observacao);
    },
    ObservacaoAtualizada: (observacao) => {
        console.log(observacao);
    }
};

app.post('/lembretes/:id/observacoes', async (req, res) => {
    const idObs = uuidv4();
    const { texto } = req.body;
    const observacoesDoLembrete = observacoesPorLembreteId[req.params.id] || [];
    observacoesDoLembrete.push({
        id: idObs,
        texto,
        status: 'aguardando'
    });
    observacoesPorLembreteId[req.params.id] = observacoesDoLembrete;
    await axios.post('http://localhost:10000/eventos', {
        tipo: "ObservacaoCriada",
        dados: {
            id: idObs,
            texto,
            lembreteId: req.params.id,
            status: 'aguardando'
        }
    });
    res.status(201).send(observacoesDoLembrete);
});

app.get('/lembretes/:id/observacoes', (req, res) => {
    res.send(observacoesPorLembreteId[req.params.id] || []);
});

app.post("/eventos", (req, res) => {
    console.log("Evento de Observação: " + req.body.tipo);
    funcoes[req.body.tipo](req.body.dados);
    res.send({ msg: "ok" });
});

app.listen(5000, () => {
    console.log('Observações. Porta 5000.');
});