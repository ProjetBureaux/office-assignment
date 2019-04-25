import * as React from 'react';
import { RouteProps } from 'react-router';
import UserDataService from '../service/UserDataService';
import StatusDataService from '../service/StatusDataService';
import { withRouter } from 'react-router';
import { Formik, Form, Field, ErrorMessage} from 'formik';


interface Props{
}

interface Statut{
    id : number;
    nom : string;
    place : number;
    type : string ;
}

interface State{
    id : number;
    nom : string;
    prenom : string;
    nomStatut : string;
    dateArrivee : Date;
    dateDepart : Date;
    statut : Statut;
    statuts : Array<Statut>;
}

interface Err{
    nom : string;
    prenom : string;
    nomStatut : string;
    dateArrivee : string;
    dateDepart : string;
    statut : Statut;
    statuts : Array<Statut>;
    dateerr : string;
}

class UserComponentUpdate extends React.Component<Props & RouteProps ,State> {



    constructor(props) {
        super(props);

        this.state = {
            id: this.props.router.params.id,
            nom : "",
            prenom : "",
            nomStatut : "",
            dateArrivee : new Date(),
            dateDepart : new Date(),
            statut : {id : 0,nom:"",place:0,type:"Std"},
            statuts : []
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.validate = this.validate.bind(this);
    }


    validate(values) {
        const errors = {} as Err;
        if (!values.nom) {
            errors.nom = 'Enter a Name';
        } else if (values.nom.length < 2) {
            errors.nom= 'Enter at least 2 Characters in Nom';
        }

        if (!values.prenom) {
             errors.prenom= 'Enter a Prenom';
        } else if (values.prenom.length < 2) {
             errors.prenom= 'Enter at least 2 Characters in Prenom';
        }

        if(values.dateArrivee>values.dateDepart){
            errors.dateArrivee= "La date d'arrivée doit être avant la date de départ";
            errors.dateDepart= "La date d'arrivée doit être avant la date de départ";
            alert(JSON.stringify(errors));
        }

        return errors;

    }

    onSubmit(values) {
        this.state.statuts.map((statut1: Statut)=>{
            if(statut1.nom === values.nomStatut){
                const user = {
                    id: this.state.id,
                    nom: values.nom,
                    prenom: values.prenom,
                    nomStatut : values.nomStatut,
                    dateArrivee : new Date(values.dateArrivee),
                    dateDepart : new Date(values.dateDepart),
                    statut : statut1
                }
                alert(JSON.stringify(user.statut,null,4))
                UserDataService.updateUser(this.state.id, user)
                    .then(() => this.props.router.push('/users'))
            }
        })
    }

    componentDidMount() {
        UserDataService.retrieveUser( this.state.id)
            .then(response => this.setState({
            nom: response.data.nom,
            prenom: response.data.prenom,
            nomStatut: response.data.nomStatut,
            dateArrivee : response.data.dateArrivee,
            dateDepart : response.data.dateDepart,
            statut : response.data.statut
            }));
        StatusDataService.retrieveStatuts()
            .then(response => this.setState({
            statuts : response.data
            }));
    }


    render() {
        return (
            <div className="container">
                <h3>User</h3>
                <div className="container">
                    <Formik
                    initialValues={{id : this.props.router.params.id,
                                    nom : this.state.nom,
                                    prenom : this.state.prenom,
                                    nomStatut : this.state.nomStatut,
                                    dateArrivee : this.state.dateArrivee,
                                    dateDepart : this.state.dateDepart,
                                    statut : this.state.statut
                                    }}
                    onSubmit={this.onSubmit}
                    validateOnChange={false}
                    validateOnBlur={false}
                    validate={this.validate}
                    enableReinitialize={true}>
                        {
                            (props) => (
                                 <Form>
                                      <fieldset className="form-group">
                                           <label>Id</label>
                                           <Field className="form-control" type="text" name="id" disabled={true} />
                                      </fieldset>
                                      <fieldset className="form-group">
                                           <label>Nom</label>
                                           <Field className="form-control" type="text" name="nom" />
                                           <ErrorMessage name="nom" component="div" className="alert alert-warning" />
                                      </fieldset>
                                      <fieldset className="form-group">
                                           <label>Prenom</label>
                                           <Field className="form-control" type="text" name="prenom" />
                                           <ErrorMessage name="prenom" component="div" className="alert alert-warning" />
                                      </fieldset>
                                      <fieldset className="form-group">
                                           <label>Statut</label>
                                           <Field  className="form-control" component="select" name="nomStatut" placeholder="Statut">
                                                <option value="" selected={true} disabled={true} hidden={true}>Choose here</option>
                                                <option value="Professeur">Professeur</option>
                                                <option value="PhD">PhD</option>
                                                <option value="PostDoc">PostDoc</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Stagiaire">Stagiaire</option>
                                           </Field>
                                      </fieldset>
                                      <div className="row">
                                        <div className="col">
                                            <fieldset className="form-group">
                                                <label>Date Arrivée</label>
                                                <Field className="form-control" type="date" name="dateArrivee" />
                                                <ErrorMessage name="dateDepart" component="div" className="alert alert-warning" />
                                            </fieldset>
                                        </div>
                                        <div className="col">
                                            <fieldset className="form-group">
                                                <label>Date Départ</label>
                                                <Field className="form-control" type="date" name="dateDepart"/>
                                                <ErrorMessage name="dateDepart" component="div" className="alert alert-warning" />
                                            </fieldset>
                                        </div>
                                      </div>
                                      <button className="btn btn-success" type="submit">Enregistrer</button>
                                 </Form>
                            )
                        }
                    </Formik>
                </div>
            </div>
        );
    }
}

export default withRouter(UserComponentUpdate);