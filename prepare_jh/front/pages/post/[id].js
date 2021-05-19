import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import wrapper from '../../store/configureStore';
import { useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_POST_REQUEST } from '../../reducers/post';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';

const Post = () => {
  const router = useRouter();
  //const id = router.query.id;
  const { id } = router.query;

  const { singlePost } = useSelector((state) => state.post);

  // if (router.isFallback && !singlePost) {
  //   return <div>로딩 중...</div>;
  // } else {
  //   console.log(
  //     '--------------------------------------------------',
  //     singlePost
  //   );
  // }

  return (
    <AppLayout>
      <Head>
        <title>
          {singlePost.User.nickname}
          님의 글
        </title>
        <meta name="description" content={singlePost.content} />
        {/* og가 카톡에서 뜨는 미리보기나 설명 등에 사용되는 값이다.  */}
        <meta
          property="og:title"
          content={`${singlePost.User.nickname}님의 게시글`}
        />
        <meta property="og:description" content={singlePost.content} />
        <meta
          property="og:image"
          content={
            singlePost.Images[0]
              ? singlePost.Images[0].src
              : 'https://nodebird.com/favicon.ico'
          }
        />
        <meta property="og:url" content={`https://nodebird.com/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  );
};

// export async function getStaticPaths() {
//   return {
//     paths: [
//       { params: { id: '1' } },
//       { params: { id: '2' } },
//       { params: { id: '3' } },
//     ],
//     fallback: true,
//   };
// }

// export const getStaticProps = wrapper.getStaticProps(async (context) => {
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    console.log('getServerSideProps start');
    // console.log(context.req.headers);
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_POST_REQUEST,
      //next에서 [id]값은 params 또는 query로 가져올 수 있다.
      data: context.params.id,
      // data: context.query.id,
    });
    context.store.dispatch(END);
    console.log('getServerSideProps end');
    await context.store.sagaTask.toPromise();
  }
);

export default Post;