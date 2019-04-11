import React, { Component } from 'react';
import api from '../../services/api';
import css from './Main.module.scss';

import logo from '../../assets/logo.svg';

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      loading: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLoading = this.handleLoading.bind(this);
  }

  handleLoading = loading => {
    this.setState({ loading });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { title } = this.state;
    const { history } = this.props;

    this.handleLoading(true);

    const response = await api.post('boxes', {
      title
    });

    this.handleLoading(false);

    history.push(`/box/${response.data._id}`);
  };

  handleChange = event => {
    const { value, name } = event.target;
    if (value) {
      this.setState({ [name]: value });
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <div className={css.main}>
        <form onSubmit={this.handleSubmit}>
          <img src={logo} alt="Logo" />
          <input
            placeholder="Digite um texto"
            onChange={e => this.handleChange(e)}
            name="title"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Criar'}
          </button>
        </form>
      </div>
    );
  }
}
