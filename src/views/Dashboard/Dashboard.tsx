import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import People from "@material-ui/icons/People";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import HowToReg from "@material-ui/icons/HowToReg";
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';

import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
import CheckIcon from "@material-ui/icons/Check";
// core components
import GridItem from "../../components/Grid/GridItem";
import GridContainer from "../../components/Grid/GridContainer";
import Table from "../../components/Table/Table";
import Tasks from "../../components/Tasks/Tasks";
import CustomTabs from "../../components/CustomTabs/CustomTabs";
import Danger from "../../components/Typography/Danger";
import Card from "../../components/Card/Card";
import Button from "../../components/CustomButtons/Button";
import CardHeader from "../../components/Card/CardHeader";
import CardIcon from "../../components/Card/CardIcon";
import CardBody from "../../components/Card/CardBody";
import CardFooter from "../../components/Card/CardFooter";

import { bugs, website, server } from "../../variables/general";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from "../../variables/charts";

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle";
import CustomInput from "../../components/CustomInput/CustomInput";
import { InputLabel } from "@material-ui/core";
import Success from "../../components/Typography/Success";
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

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: 0,
      creatingMessage: false,
      messageSuccess: true,
      messageFailed: true,
      query: "",
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
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
  }

  componentDidMount = async () => {
    const response = (await fetch(
      "https://covid19-brazil-api.now.sh/api/report/v1"
    ).then((res) => res.json())) as { data: DataResponse[] };
    const initialState = (await fetch(
      `https://covid19-brazil-api.now.sh/api/report/v1/brazil/uf/rj`
    ).then((res) => res.json())) as DataResponse;
    this.setState({ data: response.data, currentInfo: initialState });
  };

  handleChange = (event: any, value: number) => {
    this.setState({ value });
  };

  handleChangeIndex = (index: number) => {
    this.setState({ value: index });
  };

  handleSubmit = async () => {
    const response = (await fetch(
      `https://covid19-brazil-api.now.sh/api/report/v1/brazil/uf/${
        this.state.query
      }`
    ).then((res) => res.json())) as DataResponse;
    this.setState({ currentInfo: response });
    console.log(response);
  };

  render() {
    const { classes } = this.props;
    const { creatingMessage, messageFailed, messageSuccess } = this.state;
    return (
      
      <div>
        <div style={{ padding: 30 }}>
          <h3>Pesquise pela sigla do seu estado</h3>
          <input
          style={{ padding: 5, borderRadius:30, height: 20 }}
            value={this.state.query}
            onChange={(e) => this.setState({ query: e.target.value })}
          />
          <Button style={{borderRadius: 50, width: 70, height: 40}}color="info" onClick={() => this.handleSubmit()}>
            Pesquisar
          </Button>
   {this.state.query? <h4>Exibindo dados do estado {this.state.query}</h4> :''}
        </div>
        <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
            <CardDash
              classes={classes}
              icon={<People />}
              title="Casos"
              subtitle="Dados fornecidos pela api Covid Braz"
              value={this.state.currentInfo.cases}
              type="success"
            />
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <CardDash
              classes={classes}
              icon={<PersonAddDisabledIcon/>}
              title="Mortes"
              subtitle="Se possível, fique em casa! Deixe o egoísmo e pratique a empatia neste momento."
              value={this.state.currentInfo.deaths}
              type="danger"
            />
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <CardDash
              classes={classes}
              icon={<Warning/>}
              title="Suspeitos"
              subtitle="Se você está com sintomas de gripe, fique em casa por 14 dias e siga as orientações da OMS para o isolamento domiciliar"
              value={this.state.currentInfo.suspects}
              type="warning"
            />
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <CardDash
              classes={classes}
              icon={<HowToReg />}
              title="Descartados"
              subtitle="Caso notificado que não se enquadrar na definição de caso suspeito. ."
              value={this.state.currentInfo.refuses}
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
                    labels: this.state.data.map((item) => item.uf),
                    series: [this.state.data.map((item) => item.deaths)],
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
                  {this.state.data.length > 0 &&
                    moment(this.state.data[0].datetime).fromNow()}
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
                  tableData={this.state.data.map((item) => {
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
}

export default withStyles(dashboardStyle)(Dashboard);
