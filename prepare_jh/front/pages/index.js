import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import wrapper from '../store/configureStore';
import { END } from 'redux-saga';
import axios from 'axios';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import { LOAD_POSTS_REQUEST } from '../reducers/post';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } =
    useSelector((state) => state.post);

  useEffect(() => {
    console.log('re-render');
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  //이 부분이 next의 getServerSideProps 처리로 이관
  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_USER_REQUEST,
  //   });
  //   dispatch({
  //     type: LOAD_POSTS_REQUEST,
  //   });
  // }, []);

  useEffect(() => {
    function onScroll() {
      // console.log(
      //   window.scrollY,
      //   document.documentElement.clientHeight,
      //   document.documentElement.scrollHeight
      // );

      let currentPos = window.scrollY + document.documentElement.clientHeight;
      if (currentPos > document.documentElement.scrollHeight - 300) {
        // console.log(
        //   'currentPos',
        //   currentPos,
        //   'Scroll hasMorePosts',
        //   hasMorePosts
        // );
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId: lastId,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    //window.addEventListener 할 때는 항상 리턴을 해주어야 한다.
    return () => {
      //리턴하면서 이벤트도 해제해야 메모리에 쌓여있지 않는다.
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

//next8
//Home.getInitialProps;

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }

    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });

    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  }
);

export default Home;
