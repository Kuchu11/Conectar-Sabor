new window.VLibras.Widget('https://vlibras.gov.br/app');

const produtos = [
  { id: 1, nome: "Picanha na Brasa 500g", preco: 89.90, categoria: "carnes", ponto: "Ao Ponto" },
  { id: 2, nome: "Maminha Manteiga 400g", preco: 68.00, categoria: "carnes", ponto: "Bem Passada" },
  { id: 3, nome: "Queijo Coalho c/ Melaço", preco: 22.00, categoria: "guarnicoes", ponto: "" },
  { id: 4, nome: "Farofa Especial Bacon", preco: 18.00, categoria: "guarnicoes", ponto: "" },
  { id: 5, nome: "Cerveja IPA 500ml", preco: 18.00, categoria: "bebidas", ponto: "" },
  { id: 6, nome: "Refrigerante Lata", preco: 7.00, categoria: "bebidas", ponto: "" }
];

let carrinho = [];
let pedidosKds = [];
let filtroAtivo = 'todos';

function renderizarProdutos(categoriaFiltro) {
  const container = document.getElementById("product-grid");
  container.innerHTML = "";

  const listaFiltrada = categoriaFiltro === 'todos' 
    ? produtos 
    : produtos.filter(function(item) { return item.categoria === categoriaFiltro; });

  listaFiltrada.forEach(function(produto) {
    const card = document.createElement("div");
    card.className = "bg-[#1E1E24] border border-[#2E2E38] rounded-xl p-3 flex flex-col justify-between hover:border-[#10B981] transition-colors";
    
    let htmlPonto = produto.ponto ? `<span class="text-[10px] bg-[#EA580C]/20 text-[#EA580C] px-2 py-0.5 rounded-full w-fit mt-1">${produto.ponto}</span>` : '';

    card.innerHTML = `
      <div>
        <h4 class="font-bold text-white text-sm leading-tight">${produto.nome}</h4>
        ${htmlPonto}
      </div>
      <div class="flex justify-between items-center mt-3 pt-2 border-t border-[#2E2E38]">
        <span class="font-['Space_Grotesk'] font-bold text-[#10B981] text-sm">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
        <button onclick="adicionarAoCarrinho(${produto.id})" class="h-8 w-8 bg-[#26262F] hover:bg-[#10B981] hover:text-[#003824] rounded-lg flex items-center justify-center font-bold text-white transition-colors">
          +
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function filtrarCategoria(categoriaNome) {
  filtroAtivo = categoriaNome;
  renderizarProdutos(categoriaNome);
}

function adicionarAoCarrinho(produtoId) {
  const produto = produtos.find(function(item) { return item.id === produtoId; });
  const itemExistente = carrinho.find(function(item) { return item.id === produtoId; });

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }
  atualizarCarrinhoVisual("atualizar");
}

function alterarQuantidade(produtoId, delta) {
  const item = carrinho.find(function(elemento) { return elemento.id === produtoId; });
  if (!item) return;

  item.quantidade += delta;
  if (item.quantidade <= 0) {
    carrinho = carrinho.filter(function(elemento) { return elemento.id !== produtoId; });
  }
  atualizarCarrinhoVisual("atualizar");
}

function atualizarCarrinhoVisual(acao) {
  const cartList = document.getElementById("cart-list");
  const cartTotal = document.getElementById("cart-total");

  if (carrinho.length === 0) {
    cartList.innerHTML = `<p class="text-sm text-[#A1A1AA] text-center py-6">Nenhum item adicionado.</p>`;
    cartTotal.innerText = "R$ 0,00";
    return;
  }

  cartList.innerHTML = "";
  let total = 0;

  carrinho.forEach(function(item) {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;

    const row = document.createElement("div");
    row.className = "flex justify-between items-center bg-[#26262F] p-2 rounded-lg border border-[#2E2E38]";
    row.innerHTML = `
      <div class="flex-1 pr-2">
        <p class="text-xs font-bold text-white truncate">${item.nome}</p>
        <p class="text-[10px] text-[#10B981]">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="alterarQuantidade(${item.id}, -1)" class="w-6 h-6 bg-[#1E1E24] text-white rounded flex items-center justify-center text-xs">-</button>
        <span class="text-xs font-bold text-white">${item.quantidade}</span>
        <button onclick="alterarQuantidade(${item.id}, 1)" class="w-6 h-6 bg-[#1E1E24] text-white rounded flex items-center justify-center text-xs">+</button>
      </div>
    `;
    cartList.appendChild(row);
  });

  cartTotal.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function enviarPedidoCozinha(acao) {
  if (carrinho.length === 0) return;

  const mesa = document.getElementById("mesa-select").value;
  const novoPedido = {
    id: Date.now(),
    mesa: mesa,
    horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    status: 'novos',
    itens: [...carrinho]
  };

  pedidosKds.push(novoPedido);
  carrinho = [];
  atualizarCarrinhoVisual("limpar");
  renderizarKds("atualizar");
  alternarAba('kds');
}

function mudarStatusKds(pedidoId, proximoStatus) {
  const pedido = pedidosKds.find(function(item) { return item.id === pedidoId; });
  if (pedido) {
    pedido.status = proximoStatus;
    renderizarKds("atualizar");
  }
}

function renderizarKds(acao) {
  const colNovos = document.getElementById("kds-novos");
  const colPreparo = document.getElementById("kds-preparo");
  const colProntos = document.getElementById("kds-prontos");

  colNovos.innerHTML = "";
  colPreparo.innerHTML = "";
  colProntos.innerHTML = "";

  let countNovos = 0;
  let countPreparo = 0;
  let countProntos = 0;

  pedidosKds.forEach(function(pedido) {
    const card = document.createElement("div");
    card.className = "bg-[#1E1E24] border border-[#2E2E38] rounded-xl p-3 flex flex-col gap-2 shadow";

    let itensHtml = pedido.itens.map(function(i) {
      return `<li class="text-xs text-white flex justify-between"><span>${i.quantidade}x ${i.nome}</span></li>`;
    }).join("");

    let botoesAcao = "";
    if (pedido.status === 'novos') {
      countNovos++;
      botoesAcao = `<button onclick="mudarStatusKds(${pedido.id}, 'preparo')" class="w-full py-1.5 bg-[#EA580C] hover:bg-[#c2410c] text-white font-bold text-xs rounded">Iniciar Preparo</button>`;
      card.innerHTML = `
        <div class="flex justify-between border-b border-[#2E2E38] pb-1">
          <span class="font-bold text-white text-sm">${pedido.mesa}</span>
          <span class="text-xs text-[#A1A1AA]">${pedido.horario}</span>
        </div>
        <ul class="flex flex-col gap-1 py-1">${itensHtml}</ul>
        ${botoesAcao}
      `;
      colNovos.appendChild(card);
    } else if (pedido.status === 'preparo') {
      countPreparo++;
      botoesAcao = `<button onclick="mudarStatusKds(${pedido.id}, 'prontos')" class="w-full py-1.5 bg-[#10B981] text-[#003824] hover:bg-[#059669] font-bold text-xs rounded">Pronto p/ Servir</button>`;
      card.innerHTML = `
        <div class="flex justify-between border-b border-[#2E2E38] pb-1">
          <span class="font-bold text-white text-sm">${pedido.mesa}</span>
          <span class="text-xs text-[#A1A1AA]">${pedido.horario}</span>
        </div>
        <ul class="flex flex-col gap-1 py-1">${itensHtml}</ul>
        ${botoesAcao}
      `;
      colPreparo.appendChild(card);
    } else if (pedido.status === 'prontos') {
      countProntos++;
      card.innerHTML = `
        <div class="flex justify-between border-b border-[#2E2E38] pb-1">
          <span class="font-bold text-white text-sm">${pedido.mesa}</span>
          <span class="text-xs text-[#10B981]">Concluído</span>
        </div>
        <ul class="flex flex-col gap-1 py-1">${itensHtml}</ul>
      `;
      colProntos.appendChild(card);
    }
  });

  document.getElementById("count-novos").innerText = countNovos;
  document.getElementById("count-preparo").innerText = countPreparo;
  document.getElementById("count-prontos").innerText = countProntos;
}

function alternarAba(abaDestino) {
  const viewPdv = document.getElementById("view-pdv");
  const viewKds = document.getElementById("view-kds");
  const btnPdv = document.getElementById("tab-pdv");
  const btnKds = document.getElementById("tab-kds");

  if (abaDestino === 'pdv') {
    viewPdv.classList.remove("hidden");
    viewKds.classList.add("hidden");
    btnPdv.className = "px-4 py-2 rounded-lg font-bold text-sm bg-[#10B981] text-[#003824]";
    btnKds.className = "px-4 py-2 rounded-lg font-bold text-sm bg-[#26262F] text-white";
  } else {
    viewPdv.classList.add("hidden");
    viewKds.classList.remove("hidden");
    btnKds.className = "px-4 py-2 rounded-lg font-bold text-sm bg-[#10B981] text-[#003824]";
    btnPdv.className = "px-4 py-2 rounded-lg font-bold text-sm bg-[#26262F] text-white";
  }
}

function abrirModalImpressao(comando) {
  const modal = document.getElementById("print-modal");
  if (comando === 'abrir') {
    if (carrinho.length === 0) return;
    
    const mesa = document.getElementById("mesa-select").value;
    document.getElementById("receipt-header").innerHTML = `MESA: ${mesa}<br>DATA: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`;
    
    let total = 0;
    const itemsContainer = document.getElementById("receipt-items");
    itemsContainer.innerHTML = "";
    
    carrinho.forEach(function(item) {
      const subtotal = item.preco * item.quantidade;
      total += subtotal;
      const div = document.createElement("div");
      div.className = "flex justify-between";
      div.innerHTML = `<span>${item.quantidade}x ${item.nome}</span><span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span>`;
      itemsContainer.appendChild(div);
    });

    document.getElementById("receipt-total").innerHTML = `<span>TOTAL GERAL:</span><span>R$ ${total.toFixed(2).replace('.', ',')}</span>`;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  } else {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

renderizarProdutos("todos");