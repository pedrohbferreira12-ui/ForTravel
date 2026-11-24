const CHAVE = "forTravelCarrinho";

const moeda = (v) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function lerCarrinho() {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
}

function salvarCarrinho(carrinho) {
    localStorage.setItem(CHAVE, JSON.stringify(carrinho));
}

// Chame esta função a partir dos botões "Adicionar" das outras páginas
function adicionarAoCarrinho(produto) {
    const carrinho = lerCarrinho();
    const existente = carrinho.find((i) => i.id === produto.id);
    if (existente) {
        existente.qtd += 1;
    } else {
        carrinho.push({ ...produto, qtd: 1 });
    }
    salvarCarrinho(carrinho);
}

function alterarQtd(id, delta) {
    let carrinho = lerCarrinho();
    const item = carrinho.find((i) => i.id === id);
    if (!item) return;
    item.qtd += delta;
    if (item.qtd <= 0) carrinho = carrinho.filter((i) => i.id !== id);
    salvarCarrinho(carrinho);
    renderizar();
}

function removerItem(id) {
    salvarCarrinho(lerCarrinho().filter((i) => i.id !== id));
    renderizar();
}

function renderizar() {
    const lista = document.getElementById("carrinho-itens");
    if (!lista) return; // não está na página do carrinho

    const carrinho = lerCarrinho();

    if (carrinho.length === 0) {
        lista.innerHTML = `<p class="carrinho-vazio">Seu carrinho está vazio.</p>`;
    } else {
        lista.innerHTML = carrinho
            .map(
                (i) => `
            <article class="item">
                <img src="${i.imagem}" alt="${i.nome}">
                <div class="item-info">
                    <h4>${i.nome}</h4>
                    <p>${moeda(i.preco)}</p>
                </div>
                <div class="item-qtd">
                    <button type="button" data-acao="menos" data-id="${i.id}" aria-label="Diminuir">−</button>
                    <span>${i.qtd}</span>
                    <button type="button" data-acao="mais" data-id="${i.id}" aria-label="Aumentar">+</button>
                </div>
                <strong class="item-subtotal">${moeda(i.preco * i.qtd)}</strong>
                <button type="button" class="item-remover" data-acao="remover" data-id="${i.id}" aria-label="Remover ${i.nome}">✕</button>
            </article>`
            )
            .join("");
    }

    document.getElementById("total-itens").textContent =
        carrinho.reduce((s, i) => s + i.qtd, 0);
    document.getElementById("total-valor").textContent = moeda(
        carrinho.reduce((s, i) => s + i.preco * i.qtd, 0)
    );
}

document.addEventListener("click", (e) => {
    // Botões de adicionar (em qualquer página)
    const add = e.target.closest(".btn-adicionar");
    if (add) {
        adicionarAoCarrinho({
            id: add.dataset.id,
            nome: add.dataset.nome,
            preco: parseFloat(add.dataset.preco),
            imagem: add.dataset.imagem,
        });
        add.textContent = "Adicionado ✓";
        setTimeout(() => (add.textContent = "Adicionar ao carrinho"), 1200);
        return;
    }

    // Ações dentro do carrinho
    const btn = e.target.closest("[data-acao]");
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.acao === "mais") alterarQtd(id, 1);
    if (btn.dataset.acao === "menos") alterarQtd(id, -1);
    if (btn.dataset.acao === "remover") removerItem(id);
});

document.getElementById("btn-limpar")?.addEventListener("click", () => {
    salvarCarrinho([]);
    renderizar();
});

document.getElementById("btn-finalizar")?.addEventListener("click", () => {
    const carrinho = lerCarrinho();
    if (carrinho.length === 0) return alert("Seu carrinho está vazio.");

    // Envia o pedido pelo WhatsApp da agência
    const linhas = carrinho.map((i) => `• ${i.qtd}x ${i.nome} - ${moeda(i.preco * i.qtd)}`);
    const total = moeda(carrinho.reduce((s, i) => s + i.preco * i.qtd, 0));
    const msg = `Olá! Gostaria de reservar:\n${linhas.join("\n")}\nTotal: ${total}`;
    window.open(`[wa.me](https://wa.me/5511981765432?text=${encodeURIComponent(msg)})`, "_blank");
});

renderizar();