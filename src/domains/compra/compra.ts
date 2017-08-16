import { ProdutoCompra } from '../../domains/compra/produto-compra';
// import { Produto } from '../../domains/produto/produto';

export class Compra{
    
    private _id: number;

    constructor(
        private _data: Date = new Date(),
        private _produtoCompra: ProdutoCompra[] = []
    ){

    }

    set id(id: number){
        this._id = id;
    }

    set data(data: string){
        this._data = new Date(data);
    }

    get valor(){
        let total = 0.0;

        this._produtoCompra.forEach( item => total += (item.valor * item.quantidade) );

        return total;
    }

    get valorFormatado(){
        return `R$ ${this.valor.toFixed(2)}`;
    }

    get date(){
        return this._data;
    }

    get data(){
        return this._data.toISOString();
    }

    get dataMin(){
        return this.data.substr(0, 10);
    }

    get dataFormatada(){
        return `${this._data.getDate()}/${this._data.getMonth() + 1}/${this._data.getFullYear()}`;
    }

    get produtos(){
        return this._produtoCompra;
    }

    removeProduto(produto: ProdutoCompra){
        let posicao = this._produtoCompra.indexOf(produto);
        this._produtoCompra.splice(posicao, 1);
    }
}