import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { CadastroItemCompraPage } from '../../pages/cadastro-item-compra/cadastro-item-compra';
import { CadastroProdutoPage } from '../../pages/cadastro-produto/cadastro-produto';
import { Produto } from '../../domains/produto/produto';
import { Compra } from '../../domains/compra/compra';
import { ListaProduto } from '../../domains/produto/lista-produto';
import { ProdutoDao } from '../../domains/produto/produto-dao';

@IonicPage()
@Component({
  selector: 'page-pesquisa-produto',
  templateUrl: 'pesquisa-produto.html',
})

export class PesquisaProdutoPage {

  public listaProdutos: ListaProduto = new ListaProduto();
  public listaFiltrada: Produto[] = [];
  public compra: Compra;
  public titulo: string;
  private produtosIncluidos: number[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _alertCtrl: AlertController,
    private _loadingCtrl: LoadingController,
    private _dao: ProdutoDao) {

    this.compra = this.navParams.get('compraSelecionada');

  }

  ngOnInit(){
    this.carregarLista()
    .then( () => 
      this.listaFiltrada = this.listaProdutos.produtos
    );

    if (this.compra == undefined)
      this.titulo = "Lista de produtos cadastrados"
    else{
      this.titulo = "Pesquisa de Produtos"

      this.capturarIncluidos();
    }
    
  }

  capturarIncluidos(){
    this.produtosIncluidos = [];

    this.compra.produtos.forEach( (produtoCompra) => {
      this.produtosIncluidos.push(produtoCompra.produto._id);
    });
  }

  cadastrarItemCompra(produto: Produto){
    if (this.compra != undefined){

      this.navCtrl.push(CadastroItemCompraPage, {
        produtoSelecionado: produto,
        compraSelecionada: this.compra
      });

    }
  }

  pesquisar(event){
    this.listaFiltrada = this.listaProdutos.produtos;

    var valor = event.target.value;
    
    if (valor && valor.trim() != ''){
      this.listaFiltrada = this.listaProdutos.filtrarProduto(valor);
    }
  }

  alterarProduto(produto: Produto){
    this.navCtrl.push(CadastroProdutoPage, {
      'listaProdutosSelecionada': this.listaProdutos,
      'produtoSelecionado': produto
    });
  }

  removerProduto(produto: Produto){
    this.listaProdutos.removerProduto(produto);

    this._dao.salvarProdutos(this.listaProdutos.produtos);
  }

  alertaAlteracao(produto: Produto){
    this._alertCtrl.create({
      title: 'Aten????o',
      subTitle: `Alterar o produto ${produto.descricao}`,
      buttons: [{
        text: 'Sim',
        handler: () => {
          this.alterarProduto(produto);

          console.log('Alterado ' + produto.descricao);          
        }
      },{
        text: 'N??o'
      }]
    }).present();
  }

  alertaRemocao(produto: Produto){
    this._alertCtrl.create({
      title: 'Aten????o',
      subTitle: `Remover o produto ${produto.descricao}`,
      buttons: [{
        text: 'Sim',
        handler: () => {
          this.removerProduto(produto);

          console.log('Exclu??do ' + produto.descricao);          
        }
      },{
        text: 'N??o'
      }]
    }).present();
  }

  cadastroProduto(){
    this.navCtrl.push(CadastroProdutoPage, {
      'listaProdutosSelecionada': this.listaProdutos
    });
  }

  listarProdutos(){
    let temp: Produto[] = [];

    this.listaFiltrada.reverse().forEach( produto => {
      if (produto.visivel)
        temp.push(produto);
    });
    
    return temp;
  }

  carregarLista(){
    let loading = this._loadingCtrl.create({
      content: 'Carregando produtos...'
    });
    loading.present();

    return this._dao.listarProdutos()
    .then( produtos => {
      
      this.listaProdutos.limparProdutos();

      produtos.forEach( produto => {
        if (this.compra == undefined){
          // console.log('>>> lista');

          produto.visivel = true;

          this.listaProdutos.adicionarProduto(produto);
        } else {
          // console.log('>>> compra');
          
          let contem = false;

          this.produtosIncluidos.forEach( id => {
            if (id == produto._id){
              contem = true;
              return;
            }
          });
          
          produto.visivel = !contem;

          this.listaProdutos.adicionarProduto(produto);
        }
      });

      loading.dismiss();
    })
    .catch( () => {
      this.listaProdutos.limparProdutos();
      
      loading.dismiss();
    });
  }

}
