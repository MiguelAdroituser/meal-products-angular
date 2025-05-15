import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { ProductsService } from '../../services/products.service';
import { FormControl, FormGroup } from '@angular/forms';
import { modalOptions } from '../../types/modal-action.enum';
import { modalAction } from '../../types/modal-action';

import Swal from 'sweetalert2';
import { showAlertSuccess, showAlertError, showAlertConfirm } from '../../sweetAlerts/alerts';
import { WebSocketService } from '../../../auth/services/web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html'
})
export class ListPageComponent implements OnInit {

  public productForm = new FormGroup({
    id:          new FormControl<number>(0),
    name:        new FormControl<string>('', { nonNullable: true }),
    description: new FormControl<string>(''),
    price:       new FormControl<string>(''),
  });

  public products: Product[] = [];
  public filteredProducts: Product[] = [];
  public _searchText: string = '';
  public isModalOpen: boolean = false;
  public modalState: modalAction = 'Create';

  public totalProducts: number = 0;
  public limitPerPage: number = 10;
  public currentPage: number = 1;
  public startProducts: number = 1;
  public endProducts: number = 1;

  private socketSubscription!: Subscription;
  
  constructor(
    private productService: ProductsService,
    private webSocketService: WebSocketService,
  ) {}

  ngOnInit(): void {
      this.loadProducts();
      this.setupRealTimeUpdates();
      //test socket connection:
      // this.webSocketService.connect('prueba desde list-page');
  }

  ngOnDestroy(): void {
    if (this.socketSubscription) {
        this.socketSubscription.unsubscribe();
    }
  }

  private setupRealTimeUpdates(): void {

    this.socketSubscription = this.webSocketService.onItemCreated()
      .subscribe(newItem => {
        if (this.currentPage === 1) {
          // Add new item to beginning of list if on first page
          this.products = [newItem, ...this.products];
          this.filteredProducts = this.filterProducts(this._searchText);
          this.totalProducts++;
          this.setRangePagination(this.products.length);
          showAlertSuccess('New item added in real-time!');
        } else {
          // Just update the count if not on first page
          this.totalProducts++;
        }
      });

    // Handle updated items
    this.webSocketService.onItemUpdated()
      .subscribe(updatedItem => {
        const index = this.products.findIndex(p => p.id === updatedItem.id);
        if (index !== -1) {
          this.products[index] = updatedItem;
          this.filteredProducts = this.filterProducts(this._searchText);
          showAlertSuccess('Item updated in real-time!');
        }
      });
  }

  loadProducts(): void {

    this.getAllProducts();
    this.getTotalProducts();

  }

  getAllProducts(): void {
    const offset = ( this.currentPage - 1 ) * this.limitPerPage;

    this.productService.getProducts( this.limitPerPage, offset )
      .subscribe( products => {

        this.products = products;

        this.filteredProducts = products;

        this.setRangePagination( products.length );

      });
  }

  setRangePagination( totalProducts: number ) {

    this.endProducts = ( (this.currentPage-1) * this.limitPerPage ) + totalProducts;

    if ( this.currentPage === 1 ) {
      this.startProducts = 1;
      return;
    }

    this.startProducts = ((this.currentPage - 1) * this.limitPerPage) + 1;

  }

  getTotalProducts(): void {
    this.productService.getTotalProducts()
      .subscribe((count:number) => this.totalProducts = count );

  }

  get currentProduct(): Product {
    const product = this.productForm.value as Product;
    return product;
  }

  onSubmit(): void {

    if ( this.productForm.invalid ) {

      showAlertError("Please fill out the form correctly");

      return;
    }

    if ( this.currentProduct.id ) {

      this.productService.updateProduct( this.currentProduct )
        .subscribe({
          next: () => this.afterModalSuccess('Product has been updated'),
          error: (message) => showAlertError(message)
        });

      return;
    }

    this.productService.createProduct( this.currentProduct )
      .subscribe({
        next: () => this.afterModalSuccess('Product has been saved'),
        error: (message) => showAlertError(message)
      })

  }

  async deleteById( id: number ): Promise<void> {

    const isConfirmed = await showAlertConfirm();

    if ( !isConfirmed ) return;

    this.productService.deleteProductById( id )
      .subscribe({
        next: () => {

          if ( this.products.length === 1 ) this.currentPage--;

          this._searchText = ''
          this.loadProducts();
          showAlertSuccess('Product deleted successfully');

        },
        error: ( message ) => showAlertError(`HTTP request failed: ${ message }`)
      })

  }

  afterModalSuccess(message: string): void {

    this._searchText = '';
    this.loadProducts();
    this.productForm.reset();
    this.isModalOpen = !this.isModalOpen;

    showAlertSuccess( message );

  }

  toggleModal( isModOpen: boolean, modAction: modalAction, product?: Product ): void {

    if ( !isModOpen ) {

      this.modalState = modAction;

      this.isModalOpen = true;

      if ( modAction === modalOptions.Edit ) {
        this.productForm.reset( product );
        return;
      }

      this.productForm.reset();

      return;

    }

    this.isModalOpen = false;

  }

  onChangePage( type: string ) {

    this._searchText = '';

    if ( type === 'Next' ) {

      const totalPages = Math.ceil(this.totalProducts / this.limitPerPage);

      if ( this.currentPage < totalPages ) {
        this.currentPage++;
        this.loadProducts();
      }

      return;
    }

    //Previous page
    if ( this.currentPage > 1 ) {
      this.currentPage--;
      this.loadProducts();
    }


  }

  isPreviousButtonDisabled(): boolean {
    return this.currentPage === 1;
  }

  isNextButtonDisabled(): boolean {
    const totalPages = Math.ceil( this.totalProducts / this.limitPerPage );
    return this.currentPage === totalPages || this.totalProducts === 0;
  }

  get searchText(){
    return this._searchText;
  }

  set searchText( value: string ) {
    this._searchText = value;
    this.filteredProducts = this.filterProducts( value );
  }

  filterProducts( term: string ): Product[] {

    if ( this.products.length === 0 || term === '' ) return this.products;

    return this.products.filter( product => {

      return  product.name.toLocaleLowerCase().includes(term.toLocaleLowerCase())
        || product.description.toLocaleLowerCase().includes(term.toLocaleLowerCase())
        || product.price.toString().toLocaleLowerCase().includes(term.toLocaleLowerCase())

    })

  }

}
