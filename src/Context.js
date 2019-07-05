import React, { Component } from 'react'
import {storeProducts, detailProduct} from './data'

const ProductContext = React.createContext()

class ProductProvider extends Component {
  state = {
    products: [],
    detailProduct: detailProduct,
    cart: [], // cart: []
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0
  }

  componentDidMount() {
    this.setProducts();
  }

  setProducts = () => {
    let products = [];
    storeProducts.forEach(item => {
      const singleItem = {...item}
      products = [...products, singleItem]
    })
    this.setState(() => ({ products }))
    // this.setState(() => {
    //   return {products: tempProducts}
    // })
  }

  getItem = id => this.state.products.find(item => item.id === id)

  handleDetail = id => {
    const product = this.getItem(id)
    this.setState(() => ({ detailProduct: product }))
  }

  addToCart = id => {
    let product = this.getItem(id)
    product.inCart = true
    product.count = 1
    product.total = product.price
    this.setState(() => ({ cart: [...this.state.cart, product] }),
     () => this.addTotals())
  }

  openModal = id => {
    const product = this.getItem(id)
    this.setState(() => ({ modalOpen: true, modalProduct: product }))
  }

  closeModal = () => {
    this.setState(() => ({ modalOpen: false }))
  }

  incrementItem = id => {
    let product = this.state.cart.find(item => item.id === id)
    product.count++
    product.total += product.price
    this.addTotals()

    /*
    Code in Video -- Never change contents in state directly. Use setState to do so.

    let tempCart = [...this.state.cart]
    let selectedProduct = tempCart.find(item => item.id === id)

    let index = tempCart.indexOf(selectedProduct)
    let product = tempCart[index]
    product.count = product.count + 1
    product.total = product.count * product.price
    this.setState(() => ({ cart: [...tempCart] }),
      () => this.addTotals())

    Same for all the places where I changed products directly.
    */
  }

  decrementItem = id => {
    let product = this.state.cart.find(item => item.id === id)
    product.count--
    if(product.count === 0) this.removeItem(id)
    else {
      product.total -= product.price
      this.addTotals()
    }
  }

  removeItem = id => {
    let tempCart = [...this.state.cart]
    tempCart = tempCart.filter(item => item.id !== id)
    let product = this.getItem(id)
    product.inCart = false
    product.count = 0
    product.total = 0
    this.setState(() => ({ cart: [...tempCart] }),
      () => this.addTotals())
  }

  clearCart = () => {
    this.setState(() => ({ cart: [] }), () => {
      this.setProducts()
      this.addTotals()
    })
  }

  addTotals = () => {
    let subTotal = 0
    this.state.cart.map(item => {
      subTotal += item.total
      return null;
    })
    let tempTax = subTotal * 0.1
    let tax = parseFloat(tempTax.toFixed(2))
    let total = subTotal + tax
    this.setState(() => ({
      cartSubTotal: subTotal,
      cartTax: tax,
      cartTotal: total
    }))
  }

  render() {
    return (
      <ProductContext.Provider value={{
        ...this.state,
        handleDetail: this.handleDetail,
        addToCart: this.addToCart,
        openModal: this.openModal,
        closeModal: this.closeModal,
        incrementItem: this.incrementItem,
        decrementItem: this.decrementItem,
        removeItem: this.removeItem,
        clearCart: this.clearCart
        }}>
          {this.props.children}
      </ProductContext.Provider>
    )
  }
}

const ProductConsumer = ProductContext.Consumer

export {ProductProvider, ProductConsumer}
