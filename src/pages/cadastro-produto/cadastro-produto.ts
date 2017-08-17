import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { Produto } from '../../domains/produto/produto';
import { ListaProduto } from '../../domains/produto/lista-produto';

/**
 * Generated class for the CadastroProdutoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cadastro-produto',
  templateUrl: 'cadastro-produto.html',
})
export class CadastroProdutoPage {

  public produto: Produto;
  public listaProdutos: ListaProduto;
  public alteracao: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private _toast: ToastController) {

    this.listaProdutos = this.navParams.get('listaProdutosSelecionada');

    this.produto = this.navParams.get('produtoSelecionado');

    if (this.produto == undefined){
      this.alteracao = false;
      this.produto = new Produto();
    } else
      this.alteracao = true;

  }

  salvarProduto(){
    if (this.produto.nome == ''){
      this._toast.create({
        message: 'Nome não deve ser vazio!',
        duration: 2000,
        position: 'middle'
      }).present();
    } else if (this.produto.unidade == ''){ 
      this.produto.unidade = 'UN'
    } else {

      if (this.alteracao)
        this.listaProdutos.alterarProduto(this.produto)
      else
        this.listaProdutos.adicionarProduto(this.produto);

      this.navCtrl.pop();
    }
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad CadastroProdutoPage');
  // }

}
