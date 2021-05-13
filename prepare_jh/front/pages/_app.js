import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';
import wrapper from '../store/configureStore';

//기존 강좌에서는 사용되었지만..이제 next-redux-saga는 더 이상 필요가 없어졌다.
//import withReduxSaga from 'next-redux-saga';

const NodeBird = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>NodeBird</title>
      </Head>
      <Component />
    </>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

// export default wrapper.withRedux(withReduxSaga(NodeBird));
export default wrapper.withRedux(NodeBird);
