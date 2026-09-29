new window.VLibras.Widget('https://vlibras.gov.br/app');

const produtos = [
  { 
    id: 1, 
    nome: "Picanha na Brasa 500g", 
    corte: "Corte Nobre com Vinagrete",
    preco: 89.90, 
    categoria: "carnes", 
    ponto: "Ao Ponto / Mal passada", 
    imagem: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    id: 2, 
    nome: "Maminha Manteiga 400g", 
    corte: "Grelhada com Manteiga de Garrafa",
    preco: 68.00, 
    categoria: "carnes", 
    ponto: "Bem passada", 
    imagem: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    id: 3, 
    nome: "Queijo Coalho c/ Melado", 
    corte: "2 Espetos Dourados",
    preco: 44.00, 
    categoria: "guarnicoes", 
    ponto: "", 
    imagem: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    id: 4, 
    nome: "Pão de Alho & Vinagrete", 
    corte: "Porção da Casa",
    preco: 19.00, 
    categoria: "guarnicoes", 
    ponto: "", 
    imagem: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    id: 5, 
    nome: "Cerveja IPA Puro Malte", 
    corte: "Servir com copo congelado",
    preco: 36.00, 
    categoria: "bebidas", 
    ponto: "", 
    imagem: "https://images.unsplash.com/photo-1608270199144-42f1b4bc0a64?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    id: 6, 
    nome: "Refrigerante Cola Lata", 
    corte: "350ml Bem Gelado",
    preco: 7.00, 
    categoria: "bebidas", 
    ponto: "", 
    imagem: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80" 
  }
];

let carrinho = [];
let categoriaSelecionada = 'todos';
let termoPesquisa = '';

function alternarCamposEntrega(destino) {
  const containerDelivery = document.getElementById("campos-delivery");
  if (destino === 'Delivery') {
    containerDelivery.classList.remove("hidden");
    containerDelivery.classList.add("flex");
  } else {
    containerDelivery.classList.add("hidden");
    containerDelivery.classList.remove("flex");
  }
  atualizarInterfaceGeral("destino");
}

function renderizarProdutos(filtroCategoria) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  const listaFiltrada = produtos.filter(function(item) {
    const matchCategoria = (filtroCategoria === 'todos') || (item.categoria === filtroCategoria);
    const matchBusca = item.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) || item.corte.toLowerCase().includes(termoPesquisa.toLowerCase());
    return matchCategoria && matchBusca;
  });

  listaFiltrada.forEach(function(produto) {
    const itemNoCarrinho = carrinho.find(function(c) { return c.id === produto.id; });
    const quantidade = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;

    const card = document.createElement("div");
    card.className = "bg-[#1e1e24] border border-[#2e2e38] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#10b981] transition-all";

    let badgePonto = produto.ponto ? `<span class="text-[9px] bg-[#ea580c]/20 text-[#ea580c] font-bold px-1.5 py-0.5 rounded-full w-fit mb-1">⦿ ${produto.ponto}</span>` : '';

    let controles = quantidade > 0 
      ? `
        <div class="flex items-center justify-between w-full bg-[#121214] rounded-xl p-1 border border-[#2e2e38]">
          <button onclick="alterarQuantidade(${produto.id}, -1)" class="w-7 h-7 bg-[#26262f] text-white rounded-lg flex items-center justify-center font-bold text-xs active:bg-[#ea580c]">-</button>
          <span class="font-display font-bold text-white text-xs">${quantidade}</span>
          <button onclick="alterarQuantidade(${produto.id}, 1)" class="w-7 h-7 bg-[#10b981] text-[#003824] rounded-lg flex items-center justify-center font-bold text-xs active:bg-[#059669]">+</button>
        </div>
      `
      : `
        <button onclick="adicionarAoCarrinho(${produto.id})" class="w-full py-1.5 bg-[#26262f] hover:bg-[#10b981] hover:text-[#003824] text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-colors">
          <span>+</span> Adicionar
        </button>
      `;

    card.innerHTML = `
      <div class="h-24 w-full overflow-hidden relative">
        <img src="${produto.imagem}" alt="${produto.nome}" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-[#1e1e24] via-transparent to-transparent"></div>
      </div>
      <div class="p-2.5 flex flex-col gap-1">
        <h4 class="font-display font-bold text-white text-xs leading-tight truncate">${produto.nome}</h4>
        <p class="text-[10px] text-[#a1a1aa] leading-none mb-1">${produto.corte}</p>
        ${badgePonto}
        <div class="font-display font-bold text-[#10b981] text-xs mb-1.5">
          R$ ${produto.preco.toFixed(2).replace('.', ',')}
        </div>
        ${controles}
      </div>
    `;
    grid.appendChild(card);
  });
}

function buscarProduto(texto) {
  termoPesquisa = texto;
  renderizarProdutos(categoriaSelecionada);
}

function filtrarCategoria(categoria, botaoElemento) {
  categoriaSelecionada = categoria;
  document.querySelectorAll('.cat-pill').forEach(function(btn) {
    btn.className = "cat-pill px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#1e1e24] text-[#a1a1aa] border border-[#2e2e38] whitespace-nowrap";
  });
  botaoElemento.className = "cat-pill px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#ea580c] text-white whitespace-nowrap";
  renderizarProdutos(categoria);
}

function adicionarAoCarrinho(produtoId) {
  const produto = produtos.find(function(item) { return item.id === produtoId; });
  const itemExistente = carrinho.find(function(item) { return item.id === produtoId; });

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }
  atualizarInterfaceGeral("atualizar");
}

function alterarQuantidade(produtoId, delta) {
  const item = carrinho.find(function(elemento) { return elemento.id === produtoId; });
  if (!item) return;

  item.quantidade += delta;
  if (item.quantidade <= 0) {
    carrinho = carrinho.filter(function(elemento) { return elemento.id !== produtoId; });
  }
  atualizarInterfaceGeral("atualizar");
}

function atualizarInterfaceGeral(acao) {
  const totalDisplay = document.getElementById("cart-total");
  const counterDisplay = document.getElementById("cart-counter");
  const destino = document.getElementById("mesa-select").value;

  let totalItens = 0;
  let quantidadeItens = 0;

  carrinho.forEach(function(item) {
    totalItens += item.preco * item.quantidade;
    quantidadeItens += item.quantidade;
  });

  let taxaEntrega = 0;
  if (destino === 'Delivery') {
    const campoTaxa = document.getElementById("delivery-taxa");
    taxaEntrega = parseFloat(campoTaxa.value) || 0;
  }

  const totalGeral = totalItens + taxaEntrega;
  totalDisplay.innerText = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
  counterDisplay.innerText = `${quantidadeItens} item(ns)`;
  renderizarProdutos(categoriaSelecionada);
}

function enviarPedidoCozinha(acao) {
  if (carrinho.length === 0) return;

  const destino = document.getElementById("mesa-select").value;
  let clienteNome = "";
  let enderecoEntrega = "";
  let entregadorNome = "";
  let taxa = 0;

  if (destino === 'Delivery') {
    clienteNome = document.getElementById("delivery-cliente").value || "Cliente Delivery";
    enderecoEntrega = document.getElementById("delivery-endereco").value || "Retirada Balcão";
    entregadorNome = document.getElementById("delivery-entregador").value || "Motoqueiro 01";
    taxa = parseFloat(document.getElementById("delivery-taxa").value) || 0;
  }

  const novoPedido = {
    id: Date.now(),
    mesa: destino === 'Delivery' ? `🛵 Delivery: ${clienteNome}` : destino,
    tipo: destino,
    endereco: enderecoEntrega,
    entregador: entregadorNome,
    taxa: taxa,
    horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    status: 'novos',
    itens: [...carrinho]
  };

  const dadosStorage = localStorage.getItem('pedidos_kds_data');
  const pedidosSalvos = dadosStorage ? JSON.parse(dadosStorage) : [];
  pedidosSalvos.unshift(novoPedido);
  localStorage.setItem('pedidos_kds_data', JSON.stringify(pedidosSalvos));

  abrirModalImpressao('abrir');

  carrinho = [];
  atualizarInterfaceGeral("limpar");
}

function abrirModalImpressao(comando) {
  const modal = document.getElementById("print-modal");
  if (comando === 'abrir') {
    if (carrinho.length === 0) return;
    
    const destino = document.getElementById("mesa-select").value;
    const header = document.getElementById("receipt-header");
    
    let infoEntrega = "";
    let taxa = 0;

    if (destino === 'Delivery') {
      const cliente = document.getElementById("delivery-cliente").value || "Consumidor";
      const endereco = document.getElementById("delivery-endereco").value || "Rua do Cliente";
      const entregador = document.getElementById("delivery-entregador").value || "Entregador Parceiro";
      taxa = parseFloat(document.getElementById("delivery-taxa").value) || 0;

      infoEntrega = `
        <div class="mt-1 pt-1 border-t border-dashed border-gray-300">
          <strong>TIPO:</strong> ENTREGA EM DOMICÍLIO (DELIVERY)<br>
          <strong>CLIENTE:</strong> ${cliente}<br>
          <strong>ENDEREÇO:</strong> ${endereco}<br>
          <strong>ENTREGADOR:</strong> ${entregador}
        </div>
      `;
    }

    header.innerHTML = `
      DATA/HORA: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}<br>
      TERMINAL: ESC/POS BT-58 (ID #04)<br>
      OPERADOR: Carlos M. (Churr. 01)<br>
      <div class="bg-black text-white font-bold p-1 mt-1 text-center flex justify-between">
        <span>${destino.toUpperCase()}</span>
        <span class="text-[#ea580c]">PEDIDO #${Date.now().toString().slice(-4)}</span>
      </div>
      ${infoEntrega}
    `;
    
    let subtotal = 0;
    const itemsContainer = document.getElementById("receipt-items");
    itemsContainer.innerHTML = "";
    
    carrinho.forEach(function(item) {
      const valorItem = item.preco * item.quantidade;
      subtotal += valorItem;
      const detalhePonto = item.ponto ? `<div class="text-[9px] text-[#ea580c]">&gt;&gt; PONTO: ${item.ponto}</div>` : '';
      const div = document.createElement("div");
      div.className = "flex flex-col border-b border-dashed border-gray-200 pb-1";
      div.innerHTML = `
        <div class="flex justify-between">
          <span><strong>${item.quantidade}x</strong> ${item.nome}</span>
          <span>${valorItem.toFixed(2).replace('.', ',')}</span>
        </div>
        ${detalhePonto}
      `;
      itemsContainer.appendChild(div);
    });

    const totalFinal = subtotal + taxa;
    document.getElementById("receipt-total").innerHTML = `
      <div class="flex justify-between font-normal text-[10px]">
        <span>SUBTOTAL:</span>
        <span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
      </div>
      <div class="flex justify-between font-normal text-[10px]">
        <span>TAXA DE ENTREGA:</span>
        <span>R$ ${taxa.toFixed(2).replace('.', ',')}</span>
      </div>
      <div class="flex justify-between font-bold text-sm pt-1 border-t border-dashed border-gray-400">
        <span>TOTAL GERAL:</span>
        <span>R$ ${totalFinal.toFixed(2).replace('.', ',')}</span>
      </div>
    `;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  } else {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

renderizarProdutos("todos");
function verificarPedidosPendentes(origem) {
  const dados = localStorage.getItem('pedidos_pendentes_aprovacao');
  const pendentes = dados ? JSON.parse(dados) : [];
  const banner = document.getElementById('banner-pedidos-online');
  const countBadge = document.getElementById('badge-pendentes-count');

  if (pendentes.length > 0) {
    banner.classList.remove('hidden');
    banner.classList.add('flex');
    countBadge.innerText = pendentes.length;
  } else {
    banner.classList.add('hidden');
    banner.classList.remove('flex');
  }
}

function abrirModalPendentes(comando) {
  const modal = document.getElementById('modal-pendentes');
  if (comando === 'abrir') {
    renderizarListaPendentes('render');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  } else {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function renderizarListaPendentes(acao) {
  const container = document.getElementById('lista-pendentes-container');
  container.innerHTML = '';

  const dados = localStorage.getItem('pedidos_pendentes_aprovacao');
  const pendentes = dados ? JSON.parse(dados) : [];

  if (pendentes.length === 0) {
    container.innerHTML = `<p class="text-xs text-[#a1a1aa] text-center py-4">Nenhum pedido pendente.</p>`;
    return;
  }

  pendentes.forEach(function(ped) {
    let subtotal = 0;
    let itensHtml = ped.itens.map(function(i) {
      subtotal += i.preco * i.quantidade;
      return `<li class="text-[11px] text-white flex justify-between"><span>${i.quantidade}x ${i.nome}</span><span>R$ ${(i.preco * i.quantidade).toFixed(2).replace('.', ',')}</span></li>`;
    }).join('');

    const total = subtotal + (ped.taxa || 0);

    const card = document.createElement('div');
    card.className = "bg-[#121214] border border-[#2e2e38] rounded-xl p-3 flex flex-col gap-2";
    card.innerHTML = `
      <div class="flex justify-between items-start border-b border-[#26262f] pb-1.5">
        <div>
          <h4 class="font-display font-bold text-white text-xs">${ped.mesa}</h4>
          <p class="text-[10px] text-[#a1a1aa]">📱 ${ped.telefone || 'Sem tel'} • ⏱️ ${ped.horario}</p>
        </div>
        <span class="text-[10px] text-[#f59e0b] font-bold bg-[#f59e0b]/10 px-1.5 py-0.5 rounded">Pendente</span>
      </div>
      <p class="text-[10px] text-[#e4e4e7]">📍 <strong>Endereço:</strong> ${ped.endereco}</p>
      <p class="text-[10px] text-[#10b981]">💳 <strong>Pagamento:</strong> ${ped.formaPagamento}</p>
      <ul class="flex flex-col gap-1 border-y border-[#26262f] py-1.5 my-1">${itensHtml}</ul>
      <div class="flex justify-between font-bold text-xs text-white">
        <span>Total:</span>
        <span class="text-[#10b981]">R$ ${total.toFixed(2).replace('.', ',')}</span>
      </div>
      <div class="grid grid-cols-2 gap-2 mt-2">
        <button onclick="recusarPedidoOnline(${ped.id})" class="py-1.5 bg-[#26262f] hover:bg-[#32323d] text-[#ef4444] rounded-lg text-xs font-bold">Recusar</button>
        <button onclick="aprovarEnviarCozinha(${ped.id})" class="py-1.5 bg-[#10b981] hover:bg-[#059669] text-[#003824] rounded-lg text-xs font-bold font-display uppercase">Aprovar &amp; Cozinha</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function aprovarEnviarCozinha(idPedido) {
  const dados = localStorage.getItem('pedidos_pendentes_aprovacao');
  let pendentes = dados ? JSON.parse(dados) : [];
  const pedido = pendentes.find(function(p) { return p.id === idPedido; });

  if (!pedido) return;

  const novoKds = {
    ...pedido,
    status: 'novos',
    origem: 'Aprovado pelo Caixa PDV'
  };

  const dadosKds = localStorage.getItem('pedidos_kds_data');
  const pedidosKds = dadosKds ? JSON.parse(dadosKds) : [];
  pedidosKds.unshift(novoKds);
  localStorage.setItem('pedidos_kds_data', JSON.stringify(pedidosKds));

  pendentes = pendentes.filter(function(p) { return p.id !== idPedido; });
  localStorage.setItem('pedidos_pendentes_aprovacao', JSON.stringify(pendentes));

  verificarPedidosPendentes('atualizar');
  renderizarListaPendentes('atualizar');
  if (pendentes.length === 0) {
    abrirModalPendentes('fechar');
  }

  alert("Pedido aprovado e despachado para a tela da cozinha!");
}

function recusarPedidoOnline(idPedido) {
  const dados = localStorage.getItem('pedidos_pendentes_aprovacao');
  let pendentes = dados ? JSON.parse(dados) : [];
  pendentes = pendentes.filter(function(p) { return p.id !== idPedido; });
  localStorage.setItem('pedidos_pendentes_aprovacao', JSON.stringify(pendentes));

  verificarPedidosPendentes('atualizar');
  renderizarListaPendentes('atualizar');
  if (pendentes.length === 0) {
    abrirModalPendentes('fechar');
  }
}

window.addEventListener('storage', function(evento) {
  if (evento.key === 'pedidos_pendentes_aprovacao') {
    verificarPedidosPendentes('storage');
  }
});

setInterval(function() {
  verificarPedidosPendentes('interval');
}, 2000);

verificarPedidosPendentes('inicial');
function verificarPedidosPendentes(origem) {
  const dados = localStorage.getItem('pedidos_pendentes_aprovacao');
  const pendentes = dados ? JSON.parse(dados) : [];
  const banner = document.getElementById('banner-pedidos-online');
  const countBadge = document.getElementById('badge-pendentes-count');

  if (pendentes.length > 0) {
    banner.classList.remove('hidden');
    banner.classList.add('flex');
    countBadge.innerText = pendentes.length;
  } else {
    banner.classList.add('hidden');
    banner.classList.remove('flex');
  }
}

function abrirModalPendentes(comando) {
  const modal = document.getElementById('modal-pendentes');
  if (comando === 'abrir') {
    renderizarListaPendentes('render');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  } else {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function renderizarListaPendentes(acao) {
  const container = document.getElementById('lista-pendentes-container');
  container.innerHTML = '';

  const dados = localStorage.getItem('pedidos_pendentes_aprovacao');
  const pendentes = dados ? JSON.parse(dados) : [];

  if (pendentes.length === 0) {
    container.innerHTML = `<p class="text-xs text-[#a1a1aa] text-center py-4">Nenhum pedido pendente.</p>`;
    return;
  }

  pendentes.forEach(function(ped) {
    let subtotal = 0;
    let itensHtml = ped.itens.map(function(i) {
      subtotal += i.preco * i.quantidade;
      return `<li class="text-[11px] text-white flex justify-between"><span>${i.quantidade}x ${i.nome}</span><span>R$ ${(i.preco * i.quantidade).toFixed(2).replace('.', ',')}</span></li>`;
    }).join('');

    const total = subtotal + (ped.taxa || 0);

    const card = document.createElement('div');
    card.className = "bg-[#121214] border border-[#2e2e38] rounded-xl p-3 flex flex-col gap-2";
    card.innerHTML = `
      <div class="flex justify-between items-start border-b border-[#26262f] pb-1.5">
        <div>
          <h4 class="font-display font-bold text-white text-xs">${ped.mesa}</h4>
          <p class="text-[10px] text-[#a1a1aa]">📱 ${ped.telefone || 'Sem tel'} • ⏱️ ${ped.horario}</p>
        </div>
        <span class="text-[10px] text-[#f59e0b] font-bold bg-[#f59e0b]/10 px-1.5 py-0.5 rounded">Pendente</span>
      </div>
      <p class="text-[10px] text-[#e4e4e7]">📍 <strong>Endereço:</strong> ${ped.endereco}</p>
      <p class="text-[10px] text-[#10b981]">💳 <strong>Pagamento:</strong> ${ped.formaPagamento}</p>
      <ul class="flex flex-col gap-1 border-y border-[#26262f] py-1.5 my-1">${itensHtml}</ul>
      <div class="flex justify-between font-bold text-xs text-white">
        <span>Total:</span>
        <span class="text-[#10b981]">R$ ${total.toFixed(2).replace('.', ',')}</span>
      </div>
      <div class="grid grid-cols-2 gap-2 mt-2">
        <button onclick="recusarPedidoOnline(${ped.id})" class="py-1.5 bg-[#26262f] hover:bg-[#32323d] text-[#ef4444] rounded-lg text-xs font-bold">Recusar</button>
        <button onclick="aprovarEnviarCozinha(${ped.id})" class="py-1.5 bg-[#10b981] hover:bg-[#059669] text-[#003824] rounded-lg text-xs font-bold font-display uppercase">Aprovar &amp; Cozinha</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function aprovarEnviarCozinha(idPedido) {
  const dados = localStorage.getItem('pedidos_pendentes_aprovacao');
  let pendentes = dados ? JSON.parse(dados) : [];
  const pedido = pendentes.find(function(p) { return p.id === idPedido; });

  if (!pedido) return;

  const novoKds = {
    ...pedido,
    status: 'novos',
    origem: 'Aprovado pelo Caixa PDV'
  };

  const dadosKds = localStorage.getItem('pedidos_kds_data');
  const pedidosKds = dadosKds ? JSON.parse(dadosKds) : [];
  pedidosKds.unshift(novoKds);
  localStorage.setItem('pedidos_kds_data', JSON.stringify(pedidosKds));

  pendentes = pendentes.filter(function(p) { return p.id !== idPedido; });
  localStorage.setItem('pedidos_pendentes_aprovacao', JSON.stringify(pendentes));

  verificarPedidosPendentes('atualizar');
  renderizarListaPendentes('atualizar');
  if (pendentes.length === 0) {
    abrirModalPendentes('fechar');
  }

  alert("Pedido aprovado e despachado para a tela da cozinha!");
}

function recusarPedidoOnline(idPedido) {
  const dados = localStorage.getItem('pedidos_pendentes_aprovacao');
  let pendentes = dados ? JSON.parse(dados) : [];
  pendentes = pendentes.filter(function(p) { return p.id !== idPedido; });
  localStorage.setItem('pedidos_pendentes_aprovacao', JSON.stringify(pendentes));

  verificarPedidosPendentes('atualizar');
  renderizarListaPendentes('atualizar');
  if (pendentes.length === 0) {
    abrirModalPendentes('fechar');
  }
}

window.addEventListener('storage', function(evento) {
  if (evento.key === 'pedidos_pendentes_aprovacao') {
    verificarPedidosPendentes('storage');
  }
});

setInterval(function() {
  verificarPedidosPendentes('interval');
}, 2000);

verificarPedidosPendentes('inicial');