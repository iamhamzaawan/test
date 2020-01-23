import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
class Application extends React.Component{
	
    constructor(props) {
      super(props);

      this.state = {
        route:"home",
        fromAccount:'BankOfChina',
        toAccount:'mcb',
        transferType: "",
        ammount: 0,
        memo:{
          text:"",
          len:0
        },
        NameTest:{
          text:"",
          len:0
        },
        fromAccounts:[
            
            {"id":"BankOfChina","amount":1612.0,"name":"BankOfChina"},
            {"id":"mcb","amount":1412.0,"name":"mcb"},    
        ],
        toAccounts:[
            {"id":"mcb","amount":1612.0,"name":"mcb"},
            {"id":"BankOfChina","amount":1412.0,"name":"BankOfChina"}    
            
           
        ],
        startDate:this.getToday(),
        endDate:null,
        frequency:null,
        modal:false,
        form: [],
        errors:[]
      };
    }
      

      changeFrom(event){
      const fromAccount = event.target.value;
      let toAccounts = [...this.state.fromAccounts];
      //toAccounts = fromAccount.without(toAccounts,fromAccount.find(toAccounts,["id",fromAccount]));
      const toAccount = (fromAccount === this.state.toAccount) ? 0 : this.state.toAccount;
      this.setState({fromAccount,toAccounts, toAccount});
    }
      changeTo(event){this.setState({toAccount: event.target.value});}
      changeAmmount(event){this.setState({ammount: event.target.value});}
      
      changeMemo(event){this.setState({memo:{text:event.target.value,len:event.target.value.length}});}
      changeNameTest(event){this.setState({NameTest:{text:event.target.value,len:event.target.value.length}});}
      changeTransfer(event){this.setState({transferType: event.target.value, endDate:null, frequency:null});}
      changeFrequency(event){this.setState({frequency: event.target.value});}
      changeStartDate(event){this.setState({startDate: event.target.value});}
      changeEndDate(event){this.setState({endDate: event.target.value});}
      showModal(modal){this.setState({modal})}
      confirmSubmit(){this.setState({modal:false, route:"confirm" })}
    restart(){this.setState({
      route:"form",
      fromAccount:'BankOfChina',
      toAccount:'mcb',
      transferType: "",
      ammount: 0,
      memo:{
        text:"",
        len:0
      },
      startDate:this.getToday(),
      endDate:null,
      frequency:null,
      modal:false,
      form: [],
      errors:[]
    })}
    setRoute(route){this.setState({route})}
      //validation wali fields
    validate(){
      let errors = {};
      let valid = true;
      if(!this.state.fromAccount) errors.fromAccount="From Account Field is Required";
      if(!this.state.toAccount) errors.toAccount="To Account Field is Required";
      if(!this.state.startDate) errors.startDate="From Account Field is Required";
      if(!this.state.ammount) errors.ammount="Ammount Field is Required";
      if(!this.state.transferType){
        errors.transferType="Transfer Type Field is Required";
      }else if(this.state.transferType==="Automatic Transfer"){
        if(!this.state.endDate) errors.endDate="End Date Field is Required";
        if(!this.state.frequency) errors.frequency="Frequency Field is Required";
      }
      
      if (Object.getOwnPropertyNames(errors).length>0) valid = false;
      this.setState({errors})
      console.log(errors);
      return valid;
    }
    // date form wali
      getToday(){
          let today = new Date();
          let dd = today.getDate();
          let mm = today.getMonth()+1;
          let yyyy = today.getFullYear();
  
          if(dd<10) dd='0'+dd;
          if(mm<10) mm='0'+mm;
  
          today = yyyy+'-'+mm+'-'+dd;
          
          return today;
      }
      
      //submit modal
      handleSubmit(event){ 
          event.preventDefault(); 
      if(!this.validate()) return;
          this.setState({
              modal:true,
              form:[
                  {"From Account": this.state.fromAccount },
                  {"To Account": this.state.toAccount },
                  {"Transfer Type": this.state.transferType },
                  {"Date" : this.state.startDate },
                  {"End Date" : this.state.endDate },
                  {"Frequency": this.state.frequency },
                  {"Amount": "PKR"+this.state.ammount },
                  {"Memo": this.state.memo.text }
              ]
          }) 
      }
      
      
      showHiddenFields(radio){
          if(radio==="One Time Transfer"){
              return (
                  <fieldset className={(this.state.errors.startDate)?"error" : ""}>
                      <label className="main-label">Transfer Date</label>
                      <input type="date" value={this.state.startDate} onChange={this.changeStartDate.bind(this)}/>
                      <i className="fa fa-calendar fa-fw"></i>
                  </fieldset>
              );
          }else if(radio==="Automatic Transfer"){
              return (
                  <HiddenFields startDate={this.state.startDate} endDate={this.state.endDate} frequency={this.state.frequency}
                      changeStartDate={this.changeStartDate.bind(this)} 
                      changeEndDate={this.changeEndDate.bind(this)} 
                      changeFrequency={this.changeFrequency.bind(this)} errors={this.state.errors}/>
              );
          }
      }
      //pop up modal
      renderModal(){
          if(!this.state.modal) return;
      console.log("Showing Modal");
          return(
              <div className="modalWindow">
                  <div className="modal-content">
                      <a href="#" className="close-button" onClick={() => {this.showModal(false)}} />
                      <Verify form={this.state.form} showModal={this.showModal.bind(this)} confirmSubmit={this.confirmSubmit.bind(this)}/>
                  </div>
              </div>
          );
      }
      //transaction wala form
      router(route){
          if(route==="form"){
              return(
          <div>
            <h3>Transfer Remittance</h3>
            <form onSubmit={this.handleSubmit.bind(this)} >
              <Select onChange={this.changeFrom.bind(this)} account={this.state.fromAccount} title="Sender" 
                css_class={(this.state.errors.fromAccount)?"half-width error" : "half-width"} serverResponse={this.state.fromAccounts}/>
              <Select onChange={this.changeTo.bind(this)} account={this.state.toAccount} title="Receiver" 
                css_class={(this.state.errors.toAccount)?"half-width right error" : "half-width right"} serverResponse={this.state.toAccounts}/>
                
              <fieldset className={(this.state.errors.transferType)?"half-width error" : "half-width"}>
                <label className="main-label">Transfer Type</label>
                <input type="radio" name="rad_transferType" id="radTransferType_ott" value="One Time Transfer" 
                  onClick={this.changeTransfer.bind(this)}/>
                <label htmlFor="radTransferType_ott">Transfer</label><br/>
                
               
              </fieldset>
              <fieldset className={(this.state.errors.ammount)?"half-width right error" : "half-width right"}>
                <label  className="main-label">Amount</label>
                <i className="fa fa-dollar fa-fw"></i>
                <input type="number" value={this.state.ammount} onChange={this.changeAmmount.bind(this)}/>
              </fieldset>
              {this.showHiddenFields(this.state.transferType)}
              <Memo onChange={this.changeMemo.bind(this)} memo={this.state.memo} maxlen={30}/>
              <NameTest onChange={this.changeNameTest.bind(this)} NameTest={this.state.NameTest} maxlen={30}/>
              <fieldset className="button-holder">
                <input type="button" className="button simpleButton" value="Cancel" />
                <input type="submit" className="button CTAButton" value="Next" />
              </fieldset>
            </form>
          </div>
              );
          } else if (route === "confirm"){
              return <Confirm form={this.state.form} setRoute={this.restart.bind(this)}/>
          } else if (route === "profile"){
        return <Profile />;
      } else if (route === "home"){
        return <home />;
      } else if (route === "contact"){
        return <Contact />;
      } else if (route === "login"){
        return <Login />;
      }
      }
      
      render(){
      console.log(this.state);
          return (
              <div className="divMain">
                  <Header setRoute={this.setRoute.bind(this)}/> 
                  <section className="mainSection">
                      {this.router(this.state.route)}
                  </section>
                  <input type="checkbox" name="chkOpenMenu" id="chkOpenMenu" className="hide" />
                  <label htmlFor="chkOpenMenu" className="lblOpenMenu smallDisplay">
                      <span className="openItem"></span>
                      <span className="closeItem"></span>
                  </label>
                  <footer/>
                  <input type="checkbox" name="chkShowFooter" id="chkShowFooter" defaultChecked="true" className="hide" />
                  {this.renderModal()}
              </div>
          );
      }
  }
  //<input type="checkbox" id="checkMenu" />


  const Header = (props) => {
      return(
      <div>
        <div className="btnMenu" >
          <label htmlFor="checkMenu">
            <i className="fa fa-bars"></i>
          </label>
        </div>
       
        <nav className="menu">
          <div className="title">Cross Border Remittance System</div>
         <ul>
            <li><label htmlFor="checkMenu" onClick={() => props.setRoute("home")}>Home</label></li>
            <li><label htmlFor="checkMenu" onClick={() => props.setRoute("profile")}>Transfer Activity</label></li>
            <li><label htmlFor="checkMenu" onClick={() => props.setRoute("form")}>New Remittance</label></li>
            <li><label htmlFor="checkMenu" onClick={() => props.setRoute("contact")}>Contact</label></li>
           
          </ul>
          
        </nav>
      </div>
    );
  }

  //form ka memo
  const Memo = (props) => {
      return(
          <fieldset>
              <label className="main-label">Memo (OPTIONAL: Maximum of {props.maxlen} characters)</label>
              <textarea maxLength={props.maxlen} id="memoText" onChange={props.onChange} value={props.memo.text}/> 
              <span>{props.maxlen - props.memo.len} characters remaining.</span>
          </fieldset>
          
      );
  }
  const NameTest = (props) => {
    return(
        <fieldset>
            <label className="main-label">NameTest (OPTIONAL: Maximum of {props.maxlen} characters)</label>
            <textarea maxLength={props.maxlen} id="NameTestText" onChange={props.onChange} value={props.NameTest.text}/> 
            <span>{props.maxlen - props.NameTest.len} characters remaining.</span>
        </fieldset>
    );
}
  
  class Select extends React.Component{
      
    constructor(props) {
        super(props);
    }
      
      componentWillMount(){
          //Load Data here!
      }
      
      render(){
          return( 
              <fieldset className={this.props.css_class}>
                  <label>{this.props.title}</label>
                  <i className="fa fa-user fa-fw"></i>
                  <select onChange={this.props.onChange} value={this.props.account}>
                      {this.props.serverResponse.map( (option) => { 
                          return (
                              <option key={option.id} value={option.id}>
                                  {option.name}
                              </option>
                          );
                      })}
                  </select>
              </fieldset>
          );
      }
  }
  // error checks for missing and or inmcolmplete fields
  const HiddenFields = (props) => {
      return (
          <div>
              <fieldset className={(props.errors.startDate)?"half-width error" : "half-width"}>
                  <label className="main-label">Start Date</label>
                  <input type="date" value={props.startDate} onChange={props.changeStartDate} />
                  <i className="fa fa-calendar fa-fw"></i>
              </fieldset>
              <fieldset className={(props.errors.endDate)?"half-width right error" : "half-width right"}>
                  <label className="main-label">End Date</label>
                  <input type="date" value={props.endDate} onChange={props.changeEndDate} />
                  <i className="fa fa-calendar fa-fw"></i>
              </fieldset>
              <fieldset className={(props.errors.frequency)?"error" : ""}>
                  <label className="main-label">Frequency</label>
                  <select value={props.frequency} onChange={props.changeFrequency}>
                      <option value="Weekly">Weekly</option>
                      <option value="Bi-Monthly">1st and 15th of each month</option>
                      <option value="Monthly">Every Month</option>
                      <option value="Every Two Months">Every Two Months</option>
                  </select>
                  <i className="fa fa-refresh fa-fw"></i>
              </fieldset>
          </div>
      );
  }
  
  const Verify = (props) => {
      return(
          <div>
              <h3>Please verify your data</h3>
        <div className="modal-body">
          <Summary form={props.form}/>
          <fieldset className="button-holder">
            <input type="button" className="button simpleButton" value="Previous" onClick={() => props.showModal(false)} />
            <input type="submit" className="button CTAButton" value="Submit" onClick={() => props.confirmSubmit()}/>
          </fieldset>
        </div>
          </div>
      );
  }
  
  const Confirm = (props) => {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
  
      if(dd<10) dd='0'+dd;
      if(mm<10) mm='0'+mm;
  
      today = mm+'/'+dd+'/'+yyyy;
      return(
          <div className="confirm">
              <div className="notice success">
                  <i className="fa fa-smile-o"></i>
                  <p>Your transfer has been successfully completed on {today} with confirmation number {Math.random() * 10000000000000000}</p>
              </div>
              <h3>Summary</h3>
              <Summary form={props.form}/>
        <div className="button-holder">
         <input type="button" className="button CTAButton" value="Do Another Transaction" onClick={() => props.setRoute("form")}/>
        </div>
          </div>
      );
  }
  
  const Summary = (props) => {
      return(
          <dl>
              {props.form.map(
                  (field) => {
                      var key = Object.getOwnPropertyNames(field);
                      if(!field[key[0]]) return null;
                      return (
                          <div key={key[0]+field[key[0]]}>
                              <dt>{key[0]}</dt>
                              <dd>{field[key[0]]}</dd>
                          </div>
                      );
                  }
              )}
          </dl>
      );
  }
  
  const pendingData = [
    {Type:"Automatic", Amount:"PKR 299", From:"Account 1", To:"Account 2", "Transaction Date":"05/23/2016"},
    {Type:"Automatic", Amount:"PKR 299", From:"Account 1", To:"Account 2", "Transaction Date":"05/23/2016"},
    {Type:"Automatic", Amount:"PKR 299", From:"Account 1", To:"Account 2", "Transaction Date":"05/23/2016"},
    {Type:"Automatic", Amount:"PKR 299", From:"Account 1", To:"Account 2", "Transaction Date":"05/23/2016"},
    {Type:"Automatic", Amount:"PKR 299", From:"Account 1", To:"Account 2", "Transaction Date":"05/23/2016"},
    {Type:"Automatic", Amount:"PKR 299", From:"Account 1", To:"Account 2", "Transaction Date":"05/23/2016"}
  ];
  
  const processedData = [
    {Type:"Automatic", Amount:"PKR 599", From:"Account 1", To:"Account 2", "Transaction Date":"05/24/2016"},
    {Type:"Automatic", Amount:"PKR 599", From:"Account 1", To:"Account 2", "Transaction Date":"05/24/2016"},
    {Type:"Automatic", Amount:"PKR 599", From:"Account 1", To:"Account 2", "Transaction Date":"05/24/2016"},
    {Type:"Automatic", Amount:"PKR 599", From:"Account 1", To:"Account 2", "Transaction Date":"05/24/2016"},
    {Type:"Automatic", Amount:"PKR 599", From:"Account 1", To:"Account 2", "Transaction Date":"05/24/2016"},
    {Type:"Automatic", Amount:"PKR 599", From:"Account 1", To:"Account 2", "Transaction Date":"05/24/2016"},
    {Type:"Automatic", Amount:"PKR 599", From:"Account 1", To:"Account 2", "Transaction Date":"05/24/2016"},
    {Type:"Automatic", Amount:"PKR 599", From:"Account 1", To:"Account 2", "Transaction Date":"05/24/2016"},
  ];
  
  const Profile = (props) => {
    return(
      <div className="transfer-activity profile">
        <h3>Transfer Activity</h3>
        <h4>Pending Transfers</h4>
        <SimpleTable data={processedData}/>
        <h4>Processed Transfers</h4>
        <SimpleTable data={pendingData}/>
      </div>
    );
  }
  
  class SimpleTable extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        header:[]     
      }
    }
    
    componentWillMount(){
      this.setState({header:Object.getOwnPropertyNames(this.props.data[0])});
    }
    
    renderHeader(columns){
      return(
        <thead>
          <tr>
            {columns.map((column, index) => {
              return(
                <td key={index}>{column}</td>
              );
            })}
          </tr>
        </thead>
      );
    }
    
    renderBody(rows, columns){
      return(
        <tbody>
          {rows.map((row,index) => {
            return(
              <tr key={index}>
                {columns.map((column,innerIndex) => {
                  return (
                    <td key={innerIndex}>{row[column]}</td>
                  );
                })}
              </tr>
            )
          })}
        </tbody>
      );
    }
    
    //Task1:
    //Is table mei data show krwana hai jo response a rha h node server se using Fetch instead of dummy data
    render(){
      if(this.state.header.length === 0) return false;
      return(
        <div className="transfer-activity-table">
          <table className="">
            {this.renderHeader(this.state.header)}
            {this.renderBody(this.props.data,this.state.header)}
          </table>
        </div>
      );
    }
  }
  class GMap extends React.Component {
  state = { zoom: 10 };


	render() {
    return <div className="GMap">
      <div className='GMap-canvas' ref="mapCanvas">
      </div>
    </div>
  }

  componentDidMount() {
    // create the map, marker and infoWindow after the component has
    // been rendered because we need to manipulate the DOM for Google =(
    this.map = this.createMap()
    this.marker = this.createMarker()
    this.infoWindow = this.createInfoWindow()
  
  }

  createMap() {
    let mapOptions = {
      zoom: this.state.zoom,
      center: this.mapCenter()
    }
   
  }


  createInfoWindow() {
    let contentString = "<div class='InfoWindow'>National Bank</div>"
  }
  
}

var initialCenter = { lng: -103.4054536, lat: 20.6737777 }


  const Contact = (props) => {
    return(
      <div className="profile">
        <h3>Contact Page</h3>
        
        <ul className="profile-content">
          <li>
            <h4>Phone Number</h4>
            <p>0333-3333333</p>
          </li>
          <li>
            <h4>Email</h4>
            <p>national@bank.com</p>
          </li>
          <li>
            <h4>Location</h4>
            <p>chunghi amar sidhu, Lahore</p>
          </li>
        </ul>
      </div>
    );
  }

  const Home = (props) => {
  }

  const Login = (props) => {
    return(
    <div className="login">
      <h5>test</h5>
      <ul className="login-content">
        <p>test par</p>
      </ul>
    </div>
    );
  }
  
  const Footer = (props) => {
      return(
          <footer>
              <div className="firstLevelFooter"></div>
              <div className="secondLevelFooter"></div>
          </footer>
      );
  }
  
  
  
  ReactDOM.render(<Application/>,document.querySelector('#root'));