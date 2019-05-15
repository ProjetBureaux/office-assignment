import React,{Component} from 'react'
import {
    AppBar,
    Avatar,
    Button,
    Dialog,
    Icon,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Toolbar
} from "@material-ui/core";
import Service from "../service/Service";
import {URL_USER_UPDATE, URL_USER_NOT_AFF} from "../utils/Constant";
import TextField from "@material-ui/core/es/TextField/TextField";
const styles = {
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: "blue",
    },
};
export default class Affecter extends Component{

    constructor(props) {
        super(props);
        console.log(props)
        this.state={
            opened:false,
            bureau:null,
            lesUtilisateurs:[],
            selected:null,
        }

    }

    componentWillMount() {
        try {
            Service.get(URL_USER_NOT_AFF)
                .then(data=>{
                    this.setState({lesUtilisateurs:data});
                });
        }catch (e) {
            console.log("erreur",e.toString());
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.opened) {
            this.setState({opened: nextProps.opened, bureau: nextProps.bureau});
        }
    }

    save=(event)=>{
        const select=this.state.select;
        select.bureau=this.state.bureau;
        console.log(this.state.bureau);
        Service.update(URL_USER_UPDATE+"/"+select.id,select,"PUT")
           .then(data=>{
               console.log(data)
              this.closed(event)
           }).catch(error=>{
               console.log(error)
       })

    }
    closed=(event)=>{
        this.setState({
            opened:false,
            select:null,
        })
        window.location.reload();
        console.log(this.props);
    }

    onSelect=(event)=>{
    }

    toggle=(event)=>{
        const key=event.currentTarget.getAttribute("indice")
        const select=this.state.lesUtilisateurs[key];
        this.setState({select:select})
        console.log(this.state.lesUtilisateurs[key]);

}

    render() {
        const {lesUtilisateurs,select}=this.state;
        return(
            <Dialog open={this.state.opened} fullScreen={true}>
                <AppBar className={styles.appBar}>
                    <Toolbar>
                        <IconButton color="inherit" onClick={this.closed} aria-label="Close">
                            <Icon>close</Icon>
                        </IconButton>

                        <Button color="inherit" onClick={this.save}>
                            <Icon>save</Icon>
                        </Button>
                    </Toolbar>
                </AppBar>
                <div style={{marginTop:"7%"}}>
                    {this.state.select!=null &&<Button>{select.nom+" "+select.prenom}</Button>}
                </div>
                <List >
                    <TextField label={"Search"}/>
                    {
                        lesUtilisateurs.map((u,index)=>(
                        <ListItem indice={index} key={index} onClick={this.toggle} style={{cursor:"pointer",border:(select!=null&&select.id==u.id)?"2px":"0px"}} >

                            <Avatar>
                                <Icon>person</Icon>
                            </Avatar>
                            <ListItemText primary={u.nom+" "+u.prenom+"    ("+u.statut.nom+")"} secondary={"Place:"+u.statut.place}  >
                            </ListItemText>
                        </ListItem>

                    ))}
                </List>
            </Dialog>
        )
    }


}
