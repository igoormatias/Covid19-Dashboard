import React, { useState, useEffect, ChangeEvent,FormEvent } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";



import axios from 'axios';

// @material-ui/icons
import People from "@material-ui/icons/People";
import Warning from "@material-ui/icons/Warning";

import AccessTime from "@material-ui/icons/AccessTime";
import HowToReg from "@material-ui/icons/HowToReg";
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';


// core components
import GridItem from "../../components/Grid/GridItem";
import GridContainer from "../../components/Grid/GridContainer";
import Table from "../../components/Table/Table";

import Card from "../../components/Card/Card";
import Button from "../../components/CustomButtons/Button";
import CardHeader from "../../components/Card/CardHeader";

import CardBody from "../../components/Card/CardBody";
import CardFooter from "../../components/Card/CardFooter";





import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle";
import CustomInput from "../../components/CustomInput/CustomInput";

import moment from "moment";
import CardDash from "../../components/CardDash";

interface Props {
  classes: any;
}

interface State {
  value: number;
  query: string;
  creatingMessage: boolean;
  messageSuccess: boolean;
  messageFailed: boolean;
  data: DataResponse[];
  currentInfo: DataResponse;
}

interface DataResponse {
  uid: number;
  uf: string;
  state: string;
  cases: number;
  deaths: number;
  suspects: number;
  refuses: number;
  datetime: string | Date;
}

interface IbgeUfResponse {
  sigla: string;
  nome:string
}
interface IbgeCityResponse {
  nome: string;
}


const Dashboard: React.FC<Props> = ({classes}) => {

  const [data, setData ] = useState<State>({
    creatingMessage: false,
    messageSuccess: true,
    messageFailed: true,
    query: "",
    value:0,
    currentInfo: {
      uid: 0,
      uf: "",
      datetime: "",
      state: "",
      cases: 0,
      deaths: 0,
      suspects: 0,
      refuses: 0,
    },
    data: [],

  })

  const [selectedUf,setSelectedUf] = useState('0');
  const [ufs,setUfs] = useState<string[]>([]);
  

  useEffect(() => {
    const getData = async () => {
      const response = (await fetch(
        "https://covid19-brazil-api.now.sh/api/report/v1"
      ).then((res) => res.json())) as { data: DataResponse[] };
      setData({ ...data, data: response.data, currentInfo: response.data[0] });
      
    };
    getData();
  }, []);

  useEffect(()=>{
    if (selectedUf === '0') {
      return;
    }
    axios.get<IbgeCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response=>{
     const ufName = response.data.map(uf=> uf.nome)
     setUfs(ufName);
    })
  },[selectedUf])

  const handleSubmit = async () => {
    const response = (await fetch(
      `https://covid19-brazil-api.now.sh/api/report/v1/brazil/uf/${
        data.query
      }`
    ).then((res) => res.json())) as DataResponse;
    setData({...data, currentInfo: response });
    
  };

  

  function handleSelectuf(event: ChangeEvent<HTMLSelectElement>){
    const uf = event.target.value;
    setSelectedUf(uf)
    console.log(handleSelectuf)
  
    
  }
  


  return (
    
 <div>
    {/* <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado</label>
              <select 
              onChange={handleSelectuf}
               value={selectedUf} 
               name="uf" 
               id="uf">
              { <option  value="0">Selecione uma UF</option> }
              {data.data.map(uf=>(
                  <option key={uf.state}value={uf.state}>{uf.state}</option>

              ))}
              </select>

            </div>
            </div> */}
   
          <div style={{ padding: 30 }}>
            <h3>Pesquise pela sigla do seu estado</h3>
            <input
            style={{ padding: 5, borderRadius:30, height: 20 }}
              value={data.query}
              onChange={(e) => setData({...data, query: e.target.value })}
            />
            <Button style={{borderRadius: 50, width: 70, height: 40}}color="info" onClick={() => handleSubmit()}>
              Pesquisar
            </Button>
     {data.query? <h4>Exibindo dados do estado {data.query}</h4> :''}
          </div>
          <GridContainer>
            <GridItem xs={12} sm={6} md={3}>
              <CardDash
                classes={classes}
                icon={<People />}
                title="Casos"
                subtitle="Dados fornecidos pela api Covid Braz"
                value={data.currentInfo.cases}
                type="success"
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <CardDash
                classes={classes}
                icon={<PersonAddDisabledIcon/>}
                title="Mortes"
                subtitle="Se possível, fique em casa! Deixe o egoísmo e pratique a empatia neste momento."
                value={data.currentInfo.deaths}
                type="danger"
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <CardDash
                classes={classes}
                icon={<Warning/>}
                title="Suspeitos"
                subtitle="Se você está com sintomas de gripe, fique em casa por 14 dias e siga as orientações da OMS para o isolamento domiciliar"
                value={data.currentInfo.suspects}
                type="warning"
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <CardDash
                classes={classes}
                icon={<HowToReg />}
                title="Descartados"
                subtitle="Caso notificado que não se enquadrar na definição de caso suspeito. ."
                value={data.currentInfo.refuses}
                type="info"
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card chart={true}>
                <CardHeader color="primary">
                  <ChartistGraph
                    className="ct-chart"
                    data={{
                      labels: data.data.map((item) => item.uf),
                      series: [data.data.map((item) => item.deaths)],
                    }}
                    type="Line"
                  />
                </CardHeader>
                <CardBody>
                  <h4 className={classes.cardTitle}>
                    Número de mortes por estado
                  </h4>
                </CardBody>
                <CardFooter chart={true}>
                  <div className={classes.stats}>
                    <AccessTime /> atualizado{" "}
                    {data.data.length > 0 &&
                      moment(data.data[0].datetime).fromNow()}
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            {/* <GridItem xs={12} sm={12} md={4}>
              <Card chart={true}>
                <CardHeader color="warning">
                  <ChartistGraph
                    className="ct-chart"
                    data={emailsSubscriptionChart.data}
                    type="Bar"
                  />
                </CardHeader>
                <CardBody>
                  <h4 className={classes.cardTitle}>Email Subscriptions</h4>
                  <p className={classes.cardCategory}>
                    Last Campaign Performance
                  </p>
                </CardBody>
                <CardFooter chart={true}>
                  <div className={classes.stats}>
                    <AccessTime /> campaign sent 2 days ago
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <Card chart={true}>
                <CardHeader color="danger">
                  <ChartistGraph
                    className="ct-chart"
                    data={completedTasksChart.data}
                    type="Line"
                  />
                </CardHeader>
                <CardBody>
                  <h4 className={classes.cardTitle}>Completed Tasks</h4>
                  <p className={classes.cardCategory}>
                    Last Campaign Performance
                  </p>
                </CardBody>
                <CardFooter chart={true}>
                  <div className={classes.stats}>
                    <AccessTime /> campaign sent 2 days ago
                  </div>
                </CardFooter>
              </Card>
            </GridItem> */}
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Dados de Covid 19 por estado</h4>
                  
                </CardHeader>
                <CardBody>
                  <Table
                    tableHeaderColor="danger"
                    tableHead={["UF", "Estado", "Casos", "Mortes", "Suspeitas"]}
                    tableData={data.data.map((item) => {
                      return [
                        item.uf,
                        item.state,
                        item.cases,
                        item.deaths,
                        item.suspects,
                      ];
                    })}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
         
        </div>
      );
          }

export default withStyles(dashboardStyle)(Dashboard);
