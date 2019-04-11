import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { MdInsertDriveFile } from 'react-icons/md';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import DropZone from 'react-dropzone';
import socket from 'socket.io-client';

import api from '../../services/api';

import css from './Box.module.scss';
import Logo from '../../assets/logo.svg';

class Box extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      box: {}
    };

    this.handleLoading = this.handleLoading.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  async componentDidMount() {
    const { match } = this.props;
    const { id } = match.params;
    this.subscribeToNewFiles(id);

    this.handleLoading(true);

    const response = await api.get(`boxes/${id}`);

    this.setState({ box: response.data });
    this.handleLoading(false);
    this.handleUpload = this.handleUpload.bind(this);
  }

  subscribeToNewFiles = id => {
    const io = socket('https://omnistack-course-backend.herokuapp.com');
    io.emit('connectRoom', id);
    io.on('file', data => {
      this.setState({
        box: { ...this.state.box, files: [data, ...this.state.box.files] }
      });
    });
  };

  handleLoading = loading => {
    this.setState({ loading });
  };

  handleUpload = files => {
    files.forEach(async item => {
      this.handleLoading(true);
      const data = new FormData();
      const { match } = this.props;
      const { id } = match.params;

      data.append('file', item);
      await api.post(`boxes/${id}/files`, data);
      this.handleLoading(false);
    });
  };

  renderContent = () => {
    const { box, loading } = this.state;
    return box ? (
      <Fragment>
        <header>
          <img src={Logo} alt="Logo" />
          <h1>{box.title || ''}</h1>
        </header>

        <DropZone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className={css['box__upload']} {...getRootProps()}>
              <input {...getInputProps()} />
              <p>
                {!loading
                  ? 'Arraste um arquivo ou clique aqui'
                  : 'Uploading...'}
              </p>
            </div>
          )}
        </DropZone>

        <ul>
          {box.files
            ? box.files.map(file => (
                <li key={file._id}>
                  <a href={file.url} className={css['box__file-info']}>
                    <MdInsertDriveFile size={24} color="#A5CFFF" />
                    <strong>{file.title}</strong>
                  </a>
                  <span>
                    Há{' '}
                    {distanceInWords(file.createdAt, new Date(), {
                      locale: pt
                    })}
                  </span>
                </li>
              ))
            : null}
        </ul>
      </Fragment>
    ) : null;
  };

  render() {
    const { loading } = this.state;

    return (
      <div className={css.box}>
        {!loading ? this.renderContent() : 'Loading...'}
      </div>
    );
  }
}

Box.propTypes = {};

export default Box;
