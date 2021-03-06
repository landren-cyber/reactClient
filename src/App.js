import React from 'react';
import logo from './logo.svg';
import './App.css';
// import { post } from '../../api/app';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {orders: []};
    this.handleRemove = this.handleRemove.bind(this);
  }
  handleRemove(name){
    this.setState(state => ({orders: state.orders.filter(order => order.name != name)}))
  }
  getOrders() {
    fetch('http://localhost:9000/cart')
    .then(response => response.json())
    .then(response => this.setState({orders:response}))
  }
  componentDidMount(){
    this.getOrders();
  }
  render(){
    return(
      <div className="app">
            <Orders orders = {this.state.orders} handleRemove = {this.handleRemove} />
            <NewOrder />
            </div>
    )
  }
}

class Order extends React.Component {
  constructor(props){
      super(props);
  }

  render() {
      return(
          <div className="order">
              <h2>{this.props.order.name}</h2>
              <p>{this.props.order.price}$</p>
              <p>{this.props.order.weight}гр</p>
              <button className="delete" onClick={() => {this.props.handleRemove(this.props.order.name)}}>&#9746;</button>
          </div>
      );
  }
}

class Orders extends React.Component {
  constructor(props) {
      super(props);
      this.state = {query: '', count: 5};
      this.handleChange = this.handleChange.bind(this);
      this.showOrders = this.showOrders.bind(this);
  }
  handleChange(e) {
      this.setState({query: e.target.value})
  }
  showOrders(e) {
    this.setState(state => ({count: this.props.orders < state.count+5 ? this.props.orders.length : state.count+5}))
  }
  render() {
      let orders = this.props.orders.slice(0, this.state.count);
      let notFound = '';
      if(this.state.query != '') {
          orders = this.props.orders.filter(order => order.name.toLowerCase().includes(this.state.query.toLowerCase()));
      }
      if(orders.length == 0) {
          notFound = <h2>Товар не найден!</h2>
      }
      return(
          <div className="orders">
              <input id="text" onChange={this.handleChange} value={this.state.query} type="text"/>
              {notFound}
          <div className="orderList">
              {orders.map((order, id) =>
              <Order order = {order} key = {id} handleRemove = {this.props.handleRemove} />)}
              <button className="ordershow" onClick={this.showOrders}>&#8595;</button>
          </div>
          </div>
      )
  }

}

class NewOrder extends React.Component {
  constructor(props) {
  super(props);
  }
  handleAdd(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    var object = {};
    formData.forEach((value, key) => {object[key] = value});
    var json = JSON.stringify(object);
    fetch('http://localhost:9000/cart/add', {method: 'POST', headers: {'Content-Type': 'application/json;charset=utf-8'}, body: json})
    .then(response => response.json())
    .then(response => console.log(response))
  }
  render() {
    return(
      <div className="add">
        <form onSubmit={this.handleAdd}>
          <input type="text" name="orderName" id=""/><br />
          <input type="number" name="orderPrice" id=""/><br />
          <input type="number" name="orderWeight" id=""/><br />
          <input type="submit"/>
        </form>
      </div>
    )
  }
  
}

export default App;
