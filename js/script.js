const divCrd = document.querySelector("#cardapio")
const divItens = document.querySelector("#itens")
const divTotal = document.querySelector("#total")

const endPoint = "https://lanches.alissonfreire.repl.co/"

const lancheSelecionado = []

let totalSaca = 0.0

class Lanches{
    constructor(objLanches) {
        this.id = objLanches.id
        this.nome = objLanches.nome
        this.descricao = objLanches.descricao
        this.preco = objLanches.preco
        this.quantidade = 1
    }
}

const addLanches = (obj) =>{

    let posicaoArray = -1

    for (let i in lancheSelecionado){
        if(lancheSelecionado[i].id == obj.id){
            posicaoArray = i
            break
        }
    }

    if(posicaoArray == -1){
        let objLanches = new Lanches(obj)
        lancheSelecionado.push(objLanches)
    }else{
        lancheSelecionado[posicaoArray].quantidade += 1
    }

    listaLanche()

    nvValor()

}

const nvValor = () =>{
    totalSaca = 0.0
    for(let obj of lancheSelecionado){
        totalSaca += obj.preco * obj.quantidade
    }

    divTotal.innerHTML = `R$ ${totalSaca.toFixed(2).replace(".",",")}`

    listaLanche()

    nvValor()

}

const removeLanches = (indice) =>{
    let objLanches = lancheSelecionado[indice]

    totalSaca -= objLanches.preco * objLanches.quantidade

    lancheSelecionado.splice(indice, 1)

    listaLanche()

    nvValor()
}

const listaLanche = () =>{
    divItens.innerHTML = ""

    lancheSelecionado.map((elem, i)=>{
        const divLanchesSelecionados = document.createElement("div")
        divLanchesSelecionados.setAttribute("class", "lanchesSelecionados")

        let Lrlanches = elem.preco * elem.quantidade

        divLanchesSelecionados.innerHTML = `${elem.nome} ${elem.descricao} ${elem.quantidade}`
        const img = document.createElement("img")
        img.setAttribute("src", "imagens/remover.png")
        img.addEventListener("click", ()=>{
            removeLanches(i)
        })

        divLanchesSelecionados.appendChild(img)

        divItens.appendChild(divLanchesSelecionados)
    })
}

const crDados = (dados) =>{
    divCrd.innerHTML = ""

    dados.map((elem, i)=>{
        const divCard = document.createElement("div")
        divCard.setAttribute("class", "card")

        const divImgCard = document.createElement("div")
        divImgCard.setAttribute("class", "imgCard")

        const imgCard = document.createElement("img")
        imgCard.setAttribute("src", elem.caminhoimg)

        divImgCard.appendChild(imgCard)

        const divDescricao = document.createElement("div")
        divDescricao.setAttribute("class", "descricao")
        divDescricao.innerHTML = elem.nome

        const divCardapio = document.createElement("div")
        divCardapio.setAttribute("class", "detalhe")
        divCardapio.innerHTML = elem.descricao

        const divVlLanches = document.createElement("div")
        divVlLanches.setAttribute("class", "valor")
        divVlLanches.innerHTML = `${elem.preco.toFixed(2).replace(".",",")}`

        const divBtn = document.createElement("button")
        divBtn.setAttribute("class", "btnAdd")

        const btnBtt = document.createElement("button")
        btnBtt.setAttribute("class", "add")
        btnBtt.innerHTML = "Adicionar"
        btnBtt.addEventListener("click", ()=>{
            addLanches(elem)
        })

        divBtn.appendChild(btnBtt)

        divCard.appendChild(divImgCard)
        divCard.appendChild(divDescricao)
        divCard.appendChild(divCardapio)
        divCard.appendChild(divVlLanches)
        divCard.appendChild(divBtn)

        divCrd.appendChild(divCard)

    })


}

const pxDdApi = () =>{
    fetch(endPoint)
    .then(res => res.json())
    .then(dados =>{
        crDados(dados)
    }).catch(console.log("NAO CONSEGUI CARREGAR OS DADOS"))
}

pxDdApi ()
document.addEventListener('DOMContentLoaded', () => {
    const sacola = document.getElementById('itens');
    const vlrTotal = document.getElementById('vlrTotal');
    let total = 0;

    // Função para atualizar o total
    function atualizarTotal() {
        vlrTotal.textContent = total.toFixed(2).replace('.', ',');
    }

    // Função para adicionar item ao carrinho
    function adicionarItem(name, price) {
        price = parseFloat(price); // Assegura que price é um número
        const itensExistentes = Array.from(sacola.children);
        let itemExistente = itensExistentes.find(item => item.dataset.name === name);

        if (itemExistente) {
            let quantidade = itemExistente.querySelector('.quantidade');
            let valorItem = itemExistente.querySelector('.valorItem');
            let precoUnitario = parseFloat(itemExistente.dataset.price);
            let qtd = parseInt(quantidade.textContent);

            quantidade.textContent = (qtd + 1);
            valorItem.textContent = (precoUnitario * (qtd + 1)).toFixed(2).replace('.', ',');
        } else {
            const item = document.createElement('div');
            item.classList.add('item');
            item.dataset.name = name;
            item.dataset.price = price;
            item.innerHTML = `
                <div class="descricao">${name}</div>
                <div class="quantidade">1</div>
                <div class="valorItem">${price.toFixed(2).replace('.', ',')}</div>
                <button class="remove" data-name="${name}" data-price="${price}">REMOVER</button>
            `;
            sacola.appendChild(item);
        }

        total += price;
        atualizarTotal();
    }

    // Função para remover item do carrinho
    function removerItem(name, price) {
        price = parseFloat(price); // Assegura que price é um número
        const item = Array.from(sacola.children).find(item => item.dataset.name === name);
        if (item) {
            let quantidade = item.querySelector('.quantidade');
            let valorItem = item.querySelector('.valorItem');
            let precoUnitario = parseFloat(item.dataset.price);
            let qtd = parseInt(quantidade.textContent);

            if (qtd > 1) {
                quantidade.textContent = (qtd - 1);
                valorItem.textContent = (precoUnitario * (qtd - 1)).toFixed(2).replace('.', ',');
            } else {
                sacola.removeChild(item);
            }

            total -= price;
            atualizarTotal();
        }
    }

    // Adiciona evento de clique aos botões "ADICIONAR"
    document.querySelectorAll('.add').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');
            adicionarItem(name, price);
        });
    });

    // Adiciona evento de clique aos botões "REMOVER"
    sacola.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove')) {
            const name = event.target.getAttribute('data-name');
            const price = event.target.getAttribute('data-price');
            removerItem(name, price);
        }
    });
});
