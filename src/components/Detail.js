import React from 'react';
import { connect } from 'dva';
import { Card } from 'hzero-ui';
import { getDetail } from '../services/list';

class Detail extends React.Component {
  constructor() {
    super();
    this.state = {
      detail: null,
    };
  }

  UNSAFE_componentWillReceiveProps ({ match: { params: { account } } }) {
    // account !== this.props.match.params.account &&
    this.fetch(account);
  }

  fetch = (account = this.props.match.params.account) => {
    getDetail(account)
      .then((detail) => {
        this.setState({ detail });
      })
      .catch(({ message }) => {
        this.setState({ detail: message });
      });
  }

  render() {
    const { match: { params: { account } }, list } = this.props;
    const detail = list.find(l => l.account === account) || this.state.detail;
    return (
      <Card title={account} style={{ margin: "20px" }}>
        <pre>
          {(detail, null, 2)}
        </pre>
      </Card>
    );
  }
}

export default connect(({ list }) => ({ list }))(Detail);
