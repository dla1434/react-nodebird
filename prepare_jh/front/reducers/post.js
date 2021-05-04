import shortId from "shortid";
import produce from "../util/produce";

export const initialState = {
  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: "제로초",
      },
      content: "첫 번째 게시글 #해시태그 #익스프레스",
      Images: [
        {
          id: shortId.generate(),
          src:
            "https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726",
        },
        {
          id: shortId.generate(),
          src: "https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg",
        },
        {
          id: shortId.generate(),
          src: "https://gimg.gilbut.co.kr/book/BN001998/rn_view_BN001998.jpg",
        },
      ],
      Comments: [
        {
          id: shortId.generate(),
          User: {
            id: shortId.generate(),
            nickname: "nere",
          },
          content: "우와 개정판이 나왔군요",
        },
        {
          id: shortId.generate(),
          User: {
            id: shortId.generate(),
            nickname: "here",
          },
          content: "얼른 사고 싶어요",
        },
      ],
    },
  ],
  //이미지가 업로드 될 때의 경로
  imagePaths: [],
  //포스트가 완료되었을 true로 변경
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

const dummyPost = (data) => ({
  id: data.id,
  content: data.content,
  User: {
    id: 1,
    nickname: "제로초",
  },
  Images: [],
  Comments: [],
});

const dummyComment = (data) => ({
  id: shortId.generate(),
  content: data,
  User: {
    id: 1,
    nickname: "제로초",
  },
});

//reducer란? 이전 상태를 액션을 통해서 다음 상태로 만드어 내는 함수
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ADD_POST_REQUEST:
        console.log("ADD_POST_REQUEST");
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS:
        console.log("ADD_POST_SUCCESS");
        draft.addPostLoading = false;
        draft.addPostDone = true;
        // draft.mainPosts = [dummyPost(action.data), ...state.mainPosts];
        // 배열을 추가도 unshift 같은 메소드를 사용해서 바로 넣어도 된다.
        //즉 이제 ...처리한 모든 부분을 변경할 수 있다.
        //unshift는 배열의 뒤가 아닌 맨 앞에 추가해주는 배열값 추가 메소드이다.
        draft.mainPosts.unshift(dummyPost(action.data));
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostError = action.error;
        break;
      case REMOVE_POST_REQUEST:
        console.log("REMOVE_POST_REQUEST");
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        console.log("REMOVE_POST_SUCCESS");
        draft.removePostLoading = false;
        draft.removePostDone = true;
        // draft.mainPosts = state.mainPosts.filter((v) => v.id !== action.data);
        //제거할때는 불변성을 처리에서 사용하던 filter가 더 편한다.
        //아니라면 splice를 써야 하는데..인덱스를 찾아서 처리해야 해서 한 줄이 더 늘어나므로 불편하다.
        draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data);
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostError = action.error;
        break;
      case ADD_COMMENT_REQUEST:
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
        break;
      case ADD_COMMENT_SUCCESS:
        //기존 소스는 먼가 엄청나게 많은 것을 ...를 사용해서 처리했지만..
        //결국 보면 Comments에 하나 추가된거다...immert를 사용하면 두 줄로 끝난다.
        const post = draft.mainPosts.find((v) => v.id === action.data.postId);
        post.Comments.unshift(dummyComment(action.data.content));

        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;
      // const postIndex = state.mainPosts.findIndex(
      //   (v) => v.id === action.data.postId
      // );
      // const post = { ...state.mainPosts[postIndex] };

      // post.Comments = [dummyComment(action.data.content), ...post.Comments];
      // const mainPosts = [...state.mainPosts];
      // mainPosts[postIndex] = post;

      // return {
      //   ...state,
      //   mainPosts,
      //   addCommentLoading: false,
      //   addCommentDone: true,
      // };
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
        break;
      default:
        break;
      // return state;
    }
  });

export default reducer;
