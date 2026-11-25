const formBusca = document.getElementById("form-busca");

if (formBusca) {
    const campoDestino = document.getElementById("destino");
    const campoOrigem = document.getElementById("origem");
    const campoIda = document.getElementById("ida");
    const campoVolta = document.getElementById("volta");
    const campoPassageiros = document.getElementById("passageiros");
    const cardsDestino = document.querySelectorAll(".destino-card");
    const contagemResultados = document.getElementById("resultado-contagem");
    const mensagemSemResultados = document.getElementById("sem-resultados");

    formBusca.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const destinoSelecionado = campoDestino.value;
        const origem = campoOrigem.value.trim();
        const dataIda = campoIda.value.split("-").reverse().join("/");
        const dataVolta = campoVolta.value.split("-").reverse().join("/");
        const passageiros = campoPassageiros.selectedOptions[0].textContent.trim();
        let totalResultados = 0;

        cardsDestino.forEach((card) => {
            const corresponde =
                destinoSelecionado === "todos" ||
                card.dataset.destino === destinoSelecionado;
            card.hidden = !corresponde;

            if (!corresponde) return;
            totalResultados += 1;

            const linkConsulta = card.querySelector(".link-consulta");
            const nomeDestino = card.querySelector("h3").textContent.trim();
            const mensagem = [
                `Olá! Tenho interesse em uma viagem para ${nomeDestino}.`,
                `Saindo de: ${origem}.`,
                `Ida: ${dataIda}.`,
                `Volta: ${dataVolta}.`,
                `Passageiros: ${passageiros}.`,
            ].join("\n");

            linkConsulta.href =
                `https://wa.me/5511981765432?text=${encodeURIComponent(mensagem)}`;
        });

        contagemResultados.textContent =
            `${totalResultados} ${totalResultados === 1 ? "destino" : "destinos"}`;
        mensagemSemResultados.hidden = totalResultados > 0;
    });
}
new window.VLibras.Widget(
    'https://vlibras.gov.br/app'
);