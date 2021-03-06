import PropTypes from 'prop-types'
import React, { Component } from "react";
import { Container, Segment, Grid, Table, Header } from "semantic-ui-react";
import CreateMessage from "./CreateMessage";

// could make it a react funcitons
class MessageView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      replyText: "",
      replySent: false
    }
  }

  displayBody = () => {
    if(this.props.IsLoggedIn && this.props.ActiveMessage.M.M.Body) {
      return atob(this.props.ActiveMessage.M.M.Body);      
    } else {
      return ""
    }
  }

  handleReplyChange = (e) => {
    this.setState({
      replyText: e
    });
  }

  messageDisplay = () => {
    if(this.props.IsLoggedIn && 
      this.props.ActiveMessage && 
      this.props.ActiveMessage.M && 
      this.props.ActiveMessage.M.M) {
      return (
        <>
          <Table compact fixed>
            <Table.Body>
              <Table.Row>
                <Table.Cell>From: </Table.Cell>
                <Table.Cell>{this.props.ActiveMessage.M.M.SenderEmail}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>To: </Table.Cell>            
                <Table.Cell>{this.props.ActiveMessage.M.M.Recipients.join(', ')}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Date: </Table.Cell>            
                <Table.Cell>{this.props.FormatTimeFn(this.props.ActiveMessage.M.SentAt)}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <Segment>
            { this.displayBody() }
          </Segment>
          <CreateMessage 
              ComponentName="Response"
              IsLoggedIn={this.props.IsLoggedIn}
              GetAccountIDFn={this.props.GetAccountIDFn}
              ActiveMessage={this.props.ActiveMessage}
              AccountEmail={this.props.AccountEmail}
              FormatTimeFn={this.props.FormatTimeFn}/>            
        </>
      );
    } else { 
      return (
        <Grid rows={4}>
          <Grid.Row>
          </Grid.Row>
        </Grid>
      );
    }
  }

  getTitle = ()=> {
    if(this.props.IsLoggedIn && 
      this.props.ActiveMessage && 
      this.props.ActiveMessage.M && 
      this.props.ActiveMessage.M.M) {
        return this.props.ActiveMessage.M.M.Subject;
    } else {
      return this.props.ComponentName;
    }
  }

  render() {
    return (
      <>
        <Segment>
          <Container>
            <Header className="header" as="h3">
              {this.getTitle()}
            </Header>
          </Container>
          {this.messageDisplay()}          
        </Segment>
      </>
    );
  }
}



MessageView.propTypes = {
  IsLoggedIn: PropTypes.bool.isRequired,
  GetAccountIDFn: PropTypes.func.isRequired,
  ActiveMessage: PropTypes.object.isRequired,
  AccountEmail: PropTypes.string.isRequired,

  FormatTimeFn: PropTypes.func
}

MessageView.defaultProps = {
  ComponentName: 'MessageView',
  FormatTimeFn: identityFn
}

function identityFn(x) { return x; }

export default MessageView;
