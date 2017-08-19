import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ListaCompra } from '../../domains/compra/lista-compra';
import { Compra } from '../../domains/compra/compra';
import { CompraDao } from '../../domains/compra/compra-dao';

/**
 * Generated class for the CadastroCompraPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cadastro-compra',
  templateUrl: 'cadastro-compra.html',
})
export class CadastroCompraPage {

  private listaCompras: ListaCompra;
  public compra: Compra;
  private alteracao: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _dao: CompraDao) {

    this.listaCompras = this.navParams.get('listaCompras');
    let compra = this.navParams.get('compraSelecionada');

    if (compra == undefined){
      this.alteracao = false;

      this.compra = new Compra();
    } else {
      this.alteracao = true;

      this.compra = compra;
    }

  }

  salvarCompra(){
    if (this.alteracao){
      this._dao.salvarCompras(this.listaCompras.compras);
      // this.listaCompras.alterarCompra(this.compra);
    } else {
      this.listaCompras.adicionarCompra(this.compra);

      this._dao.salvarCompras(this.listaCompras.compras);
    }

    this.navCtrl.pop();
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad CadastroCompraPage');
  // }

}
