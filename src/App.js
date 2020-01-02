import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

class App extends Component {

    constructor() {
        super();
        this.state = {
            drinks: [

                {
                    name: "WOP",
                    id: "5d7c44c6311c2438b65a113e",
                    price: 2,
                    image: "http://www.casadelindquist.com/uploads/images/food.casadelindquist.com/Wapatui/Wapatui%204.jpg"
                },

                {
                    name: "Beer",
                    id: "5d7da5c24a1a521f03374e80",
                    price: 2,
                    image: "https://morebeer-web-8-pavinthewaysoftw.netdna-ssl.com/product_image/morebeer/500x500/27498.png"
                }
            ],
            idField: "",
            purchaseID: "",
            balance: 0,
            wopAvailable: 0,
            method: ""
        }
    }

    componentDidMount() {
        this.startScanning()
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(this.state.someVar === nextState.someVar) return false;
    //     return true;
    //   }



    startScanning = () => {

        let GLOBAL = this
        console.log("reading RFID")


        let getBreezerURL = "http://192.168.1.203:2000/readBreezer",
            getUserURL = 'http://breezy.club:2000/getUser'

        axios.get(getBreezerURL).then(response => {
            console.log(response)

            axios.post(getUserURL, {
                rfid: response.data.rfid,
            }).then(res => {

                console.log("User validate", res.data.allRFID)

                GLOBAL.setState({
                    method: "Valid Account",
                    idField: response.data.rfid,
                    balance: res.data.allRFID.balance,
                    wopAvailable: res.data.allRFID.wopAvailable
                }, 
                this.startScanning())

            }).catch(errRes => {
                console.log('user not found error',errRes)
                let response = errRes.response

                GLOBAL.setState({
                    method: "Invalid account. Transaction room.",
                    idField: response.data.rfid,
                    balance: "0",
                    wopAvailable: "0"
                }, 
                this.startScanning()
                )

            })

        }).catch(e => {
            console.log(e)
            //TODO: if status is UID-error. Or maybe not- since if it wasn't 
        })
    }

    handlePurchase = () => {
        if (!this.state.purchaseID) {
            // console.log("recipe is not set")
            window.alert("recipe is not set")
        } else {


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
                        let { balance, wopAvailable } = json.result.updateRFID
                        this.setState({
                            balance: balance,
                            wopAvailable: wopAvailable,
                            method: json.method
                        }, ()=>{
                            setTimeout(() => {
                                this.setState({
                                    idField: "",
                                })
                              }, 2000) // Wait 2 seconds and reset the text box
                        }
                        )

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
                            method: method
                        },
                            // this.startScanning()

                        )
                    });
                }



            }).catch(e => {
                console.log(e.json())
            });
        }


    }

    handleSearchState = (e) => {
        let field = e.target.value
        this.setState({
            idField: field
        })
    }

    render() {
        const {
            drinks,
            idField
        } = this.state;


        return (
            <div className="App">
                <h1>Breezy</h1>

                <input
                    className='search'
                    type="text"
                    onChange={
                        this.handleSearchState
                    }
                    placeholder={"Put UID"}
                    value={idField}
                >
                </input>

                <button onClick={this.handlePurchase} > PURCHASE!</button>

                <div className='card-list'>

                    {drinks.map(drink => (
                        <button className='card-container' onClick={e => {
                            console.log(`clicked ${drink.name}`)
                            this.setState({
                                purchaseID: drink.id
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
