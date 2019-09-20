import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';


const Mfrc522 = require("mfrc522-rpi");
const SoftSPI = require("rpi-softspi");


//SETTING UP RFID 
const softSPI = new SoftSPI({
    clock: 23, // pin number of SCLK
    mosi: 19, // pin number of MOSI
    miso: 21, // pin number of MISO
    client: 24 // pin number of CS
});
// GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
// I believe that channing pattern is better for configuring pins which are optional methods to use.
const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);


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
shouldComponentUpdate(nextProps, nextState) {
    if(this.state.someVar === nextState.someVar) return false;
    return true;
  }
startScanning = () =>{

    const GLOBAL = this

    var refreshId = setInterval(function () {
        //# reset card
        mfrc522.reset();

        //# Scan for cards
        let response = mfrc522.findCard();

        if (!response.status) {
            console.log("No Card");
            GLOBAL.setState({
                method: 'No Card'
            })
            return;
        }

        //# Get the UID of the card
        response = mfrc522.getUid();
        if (!response.status) {
            console.log("UID Scan Error");
            GLOBAL.setState({
                method: 'UID Scan Error'
            })
            return;
        }
        //# If we have the UID, continue
        let uid = response.data;


        mfrc522.stopCrypto();



        if (uid) {
            uid.pop()
            let id = uid.join().replace(/,/g, "")
            
            this.setState({
                idField: id
            })

            clearInterval(refreshId)

            return
        }



    }, 1000)
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
