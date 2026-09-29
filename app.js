new window.VLibras.Widget('https://vlibras.gov.br/app');

const produtos = [
  { 
    id: 1, 
    nome: "Picanha na Brasa", 
    corte: "Corte Nobre 500g",
    preco: 89.90, 
    categoria: "carnes", 
    ponto: "Ao Ponto", 
    imagem: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    id: 2, 
    nome: "Maminha Manteiga", 
    corte: "Grelhada 400g",
    preco: 68.00, 
    categoria: "carnes", 
    ponto: "Bem Passada", 
    imagem: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    id: 3, 
    nome: "Queijo Coalho", 
    corte: "c/ Melaço de Cana",
    preco: 22.00, 
    categoria: "guarnicoes", 
    ponto: "", 
    imagem: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    id: 4, 
    nome: "Farofa de Bacon", 
    corte: "Crocante Especial",
    preco: 18.00, 
    categoria: "guarnicoes", 
    ponto: "", 
    imagem: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    id: 5, 
    nome: "Cerveja IPA Puro Malte", 
    corte: "Lata 473ml Gelada",
    preco: 18.00, 
    categoria: "bebidas", 
    ponto: "", 
    imagem: "https://images.unsplash.com/photo-1608270199144-42f1b4bc0a64?auto=format&fit=crop&w=500&q=80" 
  },
  { 
    id: 6, 
    nome: "Refrigerante Cola", 
    corte: "Lata 350ml",
    preco: 7.00, 
    categoria: "bebidas", 
    ponto: "", 
    imagem: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80" 
  }
];

let carrinho = [];
let categoriaSelecionada = 'todos';
let termoPesquisa = '';

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

  let total = 0;
  let quantidadeItens = 0;

  carrinho.forEach(function(item) {
    total += item.preco * item.quantidade;
    quantidadeItens += item.quantidade;
  });

  totalDisplay.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
  counterDisplay.innerText = `${quantidadeItens} item(ns)`;
  renderizarProdutos(categoriaSelecionada);
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

  const dadosStorage = localStorage.getItem('pedidos_kds_data');
  const pedidosSalvos = dadosStorage ? JSON.parse(dadosStorage) : [];
  pedidosSalvos.push(novoPedido);
  localStorage.setItem('pedidos_kds_data', JSON.stringify(pedidosSalvos));

  carrinho = [];
  atualizarInterfaceGeral("limpar");
  alert("Pedido enviado com sucesso para a cozinha!");
}

function abrirModalImpressao(comando) {
  const modal = document.getElementById("print-modal");
  if (comando === 'abrir') {
    if (carrinho.length === 0) return;
    
    const mesa = document.getElementById("mesa-select").value;
    document.getElementById("receipt-header").innerHTML = `TERMINAL: CHURRASQUEIRA 01<br>MESA: ${mesa}<br>DATA: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`;
    
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