import React,{Component} from 'react'
import {
  Badge,
  Button, Icon,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow, Tooltip
} from "@material-ui/core";
import CSVReader from "react-csv-reader";
import AddBureau from "./add-bureau";
import Service from "../service/Service";
import {URL_BU_ADD, URL_BU_ALL, URL_BU_DELETE, URL_BU_UPDATE,URL_USER_ALL} from "../utils/Constant";
import {Link} from "react-router-dom";
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import Affecter from "./Affecter";

export default class ListBureau  extends Component{

  constructor(props) {

    super(props);
    let searchStyle={
      width:"2px",
      background:"gray"
    };
    this.state = {
      lesBureaux:[],
      lesUtilisateurs:[],
      anchorEL:null,
      isSearch:false,
      isOpened:false,
      modeEdit:false,
      editValue:{},
      searchStyle:searchStyle,
      findItem:[],
      bureauAffect:null,
      openAffectDial:false
    };

  }




  componentWillReceiveProps(nextProps, nextContext) {

  }
  componentWillMount() {
    try {
      Service.get(URL_BU_ALL)
      .then(data=>{
        this.setState({lesBureaux:data});
      });

    }catch (e) {
      console.log("erreur",e.toString());
    }

    try {
      Service.get(URL_USER_ALL)
      .then(data=>{
        this.setState({lesUtilisateurs:data});
      });

    }catch (e) {
      console.log("erreur",e.toString());
    }
  }

  handleEdit=(event)=>{
    const numero=event.currentTarget.getAttribute("tag");

    const lesBureaux=this.state.lesBureaux;
    const u=lesBureaux.find((user)=>{

      return user.numero==numero;
    });
    this.setState({
      modeEdit:true,
      isOpened:true,
      editValue:u
    })

  }
  handleAdd=(event)=>{
    this.setState({isOpened:true,editValue:{}})
  }
  dialogClose=()=>{
    this.setState({isOpened:false})
  }
  save=(p,modeEdit)=>
  {
    const lesBureaux=this.state.lesBureaux;
    console.log("save",p);
    Service.update(modeEdit==false?URL_BU_ADD:(URL_BU_UPDATE+"/"+p.id),p,modeEdit?"PUT":"POST")
    .then(data=>{
      if(modeEdit==false) {
        lesBureaux.push(p);
      }else
      {
        const index=lesBureaux.findIndex((user)=>{
          return user.numero==p.numero;
        });
        lesBureaux[index]=p;
      }
      this.setState({modeEdit:false,lesBureaux:lesBureaux});
    })
  }
  handleDelete=(event)=> {
    const id=event.currentTarget.getAttribute("tag");
    const {lesBureaux}=this.state;
    this.setState({lesBureaux:lesBureaux.filter(item=> item.id!=id) })
    Service.update(URL_BU_DELETE+"/"+id,{},"DELETE")
  }
  onSortByEtat=(event)=>{
    this.setState({isSearch:true,findItem:[]});
    const sorted=event.currentTarget.getAttribute("sorted");
    let data=this.state.lesBureaux;
    let isSorted=true;
    let value=""
    switch (sorted) {
      case "none":
      value="dec"
      data.sort((a,b)=>{
        return -(a.nbPlaces-this.test(a).occupation)+(b.nbPlaces-this.test(b).occupation)
      })
      break;
      case "dec":
      value="cro";
      data.sort((a,b)=>{
        return (a.nbPlaces-this.test(a).occupation)-(b.nbPlaces-this.test(b).occupation)
      })

      break;
      case "cro":
      value="none"
      isSorted=false;
      data.sort((a,b)=>{
        return (a.id-b.id);
      })
      break;
    }
    this.setState({lesBureaux:data});
    event.currentTarget.setAttribute("sorted",value);
  }

  onSortByPlaces=(event)=>{
    this.setState({isSearch:false,findItem:[]});
    const sorted=event.currentTarget.getAttribute("sorted");
    let data=this.state.lesBureaux;
    let isSorted=true;
    let value=""
    switch (sorted) {
      case "none":
      value="dec"
      data.sort((a,b)=>{
        return (a.nbPlaces-b.nbPlaces)
      })
      break;
      case "dec":
      value="cro";
      data.sort((a,b)=>{
        return -a.nbPlaces+b.nbPlaces;
      })

      break;
      case "cro":
      value="none"
      isSorted=false;
      data.sort((a,b)=>{
        return (a.id-b.id);
      })
      break;
    }
    this.setState({lesBureaux:data});
    event.currentTarget.setAttribute("sorted",value);
  }
  searchChange=(event)=>{
    const lesBureaux=this.state.lesBureaux;
    let isSearch=true;
    if(event.target.value.length==0)
    isSearch=false;
    const   data=lesBureaux.filter(bu=>{
      return bu.numero.search(event.target.value)!=-1
    })
    this.setState({isSearch:true,findItem:data});
  }

  test(){
    let occupation = 0;
    let users = [];
    this.state.lesUtilisateurs.map((user)=>{
      if(user.bureau){
        if(user.bureau.id == arguments[0].id){
          occupation = occupation + user.statut.place
          const id =  arguments[0].id;
          users.push(user);
        }
      }
    })
    return {occupation : occupation,users :users} ;
  }

  containsZombies(){
    let res = false;
    arguments[0].map((user)=>{
      if(new Date(user.dateDepart) < new Date()){
        res = true;
      }
    })
    return res;
  }

  expired = () => {
    alert("Ce bureau contient des zombies")
  }

  notexpired = () => {
    alert("Ce bureau ne contient pas de zombies ")
  }

  handleAssign=(event)=>{
        const id=event.currentTarget.getAttribute("tag");
        const {lesBureaux}=this.state;
        console.log(id)
         const bureau=lesBureaux.find((bu)=>{
             return bu.id==id;
        })
        this.setState({
            openAffectDial:true,
            bureauAffect:bureau
        })
        console.log(this.state.openAffectDial)
    }

    dialogCloseAffec=()=>{
            this.setState({isOpened:false})
        }


  handleExport=()=>{
    /*const bureauExport = Service.get(URL_BU_ALL);
    return (<a href={URL_BU_ALL} download>download</a>)*/
  }

  handleImport=(data)=>{
    for(var i = 1; i < data.length; i++){
      const idx = this.state.lesBureaux.findIndex(bu => bu.numero === data[i][0])
        if(idx == -1) {
          const bureau = {
            numero:data[i][0],
            type:data[i][1],
            places:data[i][2],
            occupation:data[i][3],
            id:this.state.id
          }
          this.save(bureau, false);
        }
    }
  }

  render() {
    const lesBureaux=(this.state.isSearch&&this.state.findItem.length!=0)?this.state.findItem:this.state.lesBureaux;
    const anchorEL=this.state.anchorEL;
    return(
      <div>
          <div>
            <Button onClick={this.handleAdd}><Icon>add_circle</Icon></Button>
            <AddBureau editMode={this.state.modeEdit} editValue={this.state.editValue}  opened={this.state.isOpened} closed={this.dialogClose} saved={this.save}></AddBureau>
            <Button onClick={this.handleExport}><Icon>cloud_download</Icon>Export</Button>
            <br></br><a href={URL_BU_ALL} download> file </a>
            <Icon>cloud_upload</Icon>
          <CSVReader
            cssClass="react-csv-input"
            label="Import"
            onFileLoaded={this.handleImport}
          />
          </div>
          <div>
            <Affecter  bureau={this.state.bureauAffect}  opened={this.state.openAffectDial} closed={this.dialogCloseAffec} saved={this.saveAffect}></Affecter>
          </div>
        <Table >
          <TableHead style={{background:"beige"}}>
            <TableCell>Info</TableCell>
            <TableCell>Numero<input style={{background:"beige",borderColor:"white",color:"black"}} onChange={this.searchChange}  type={"text"}/></TableCell>
            <TableCell>Places <Button sorted={"none"} onClick={this.onSortByPlaces}><Icon>sort</Icon></Button></TableCell>
            <TableCell>Occupation</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Etat<Button sorted={"none"} onClick={this.onSortByEtat}><Icon>sort</Icon></Button></TableCell>
            <TableCell></TableCell>
          </TableHead>
          <TableBody>
            {
              lesBureaux.map((row)=>(
                <TableRow key={row.id}  style={{background:row.nbPlaces-this.test(row).occupation==0?"rgba(255,0,0,0.6)":
                  this.test(row).occupation==0?"":"rgba(0,255,0,0.4)"}} >

                    <TableCell>
                      <Tooltip title={this.containsZombies(this.test(row).users)!=true?"Ce bureau ne contient pas de zombies":"Ce bureau contient des zombies"}>
                    <Button color={this.containsZombies(this.test(row).users)!=true?"primary":"secondary"}><Icon>info</Icon></Button>
                    </Tooltip>
               </TableCell>
                  <TableCell>{row.numero}</TableCell>
                  <TableCell>{row.nbPlaces}</TableCell>
                  {this.test(row).occupation!=0?<TableCell><Link  to={`/bureauusers/${row.id}`}>{this.test(row).occupation}</Link></TableCell>:<TableCell>{this.test(row).occupation}</TableCell>}
                  <TableCell>{row.statut}</TableCell>
                  <TableCell><Badge showZero={true} color={row.nbPlaces==0?"secondary":""} badgeContent={row.nbPlaces-this.test(row).occupation}><Icon>mail</Icon></Badge></TableCell>
                  <TableCell>
                    <Tooltip title={"Modifier"}>
                      <Button tag={row.numero} onClick={this.handleEdit} color={"primary"}><Icon>edit</Icon></Button>
                    </Tooltip>
                    <Tooltip title={"Affecter"}>
                      <Button tag={row.id} disabled={this.test(row).occupation==row.nbPlaces} onClick={this.handleAssign} color={"primary"}><Icon>person_add</Icon></Button>
                  </Tooltip>
                    <Progress  percent={~~((this.test(row).occupation/row.nbPlaces)*100)} type="circle" width={40}   />
                  </TableCell>
                  <Menu anchorEl={anchorEL} open={Boolean(anchorEL)} >
                    <MenuItem>l</MenuItem>
                    <MenuItem>l</MenuItem>
                    <MenuItem>l</MenuItem>
                  </Menu>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
    );
  }
}
