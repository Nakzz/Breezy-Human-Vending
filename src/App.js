import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

// import {CardList} from '../src/component/card-list/card-list-component'
// import {SearchBox} from '../src/component/searchBox/searchBox-component'


class App extends Component {

constructor(){
  super();
  this.state = {
    drinks: [

        {
            name: "WOP",
            id: "5d7c44c6311c2438b65a113e",
            price: 1,
            image: "http://www.casadelindquist.com/uploads/images/food.casadelindquist.com/Wapatui/Wapatui%204.jpg"
        },

        {
            name: "Beer",
            id: "5d7da5c24a1a521f03374e80",
            price: 1,
            image: "https://morebeer-web-8-pavinthewaysoftw.netdna-ssl.com/product_image/morebeer/500x500/27498.png"
        }

    ],
    idField: "",
    purchaseID : "",
    balance : 0,
    wopAvailable : 0,
method: ""
  }
}



handleSearchState =(e) =>{
  let field = e.target.value
  this.setState({
      idField: field
  })
}

  render(){
    const {
        drinks,
        searchField
    } = this.state;


    return (
      <div className="App">
        <h1>Breezy</h1>

    <input 
    className='search' 

    onChange = {
        this.handleSearchState
    }
    placeholder={"Put UID"}
    // value={searchField}
    >
    </input>

    <button onClick={
        e=>{

            if (!this.state.purchaseID)
            console.log("recipe is not set")

            else{

        
            fetch('http://breezy.club:2000/purchase', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rfid: this.state.idField,
                    recipeID: this.state.purchaseID,
                })
            }).then(response => {
                if (response.ok) {
                    response.json().then(json => {
                        console.log(json);
                        let {balance, wopAvailable} = json.result.updateRFID
                        this.setState({
                            balance: balance,
                            wopAvailable: wopAvailable,
                            method: json.method
                        })

                    });
                } else {
                                       response.json().then(json => {
                        console.log(json);

                        let {
                            method
                        } = json
                      
this.setState({
    balance: 0,
    wopAvailable: 0,
    method:method
})
                    });
                }



            }).catch(e=>{
                console.log(e.json())
            });
        }


        }
    } > PURCHASE!</button>

<div className='card-list'>

{drinks.map( drink => (
     <button className='card-container' onClick={ e =>{
console.log(`clicked ${drink.name}`)
this.setState({
    purchaseID : drink.id
})
     }}>
    <img alt='monster' src={`${drink.image}`} />
    
    <h2>{drink.name}</h2>
    <p> {drink.price}</p>
</button>
))}

      
        
      </div>



<h1>
    User Balance: {this.state.balance}

</h1>
<h1>
    WOP Available: {this.state.wopAvailable}

</h1>
<h1>
    Status : {this.state.method}
</h1>
</div>


    );
  }

}

export default App;
