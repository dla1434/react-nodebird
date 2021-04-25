import { HYDRATE } from "next-redux-wrapper";

// const initialState = {
//   name: "zerocho",
//   age: 27,
//   password: "babo",
// };

const initialState = {
  user: {
    isLoggedIn: false,
    user: null,
    signUpData: {},
    loginData: {},
  },
  post: {
    mainPosts: [],
  },
};

export const loginAction = (data) => {
  return {
    type: "LOG_IN",
    data: data,
  };
};

export const logoutAction = () => {
  return {
    type: "LOG_OUT",
  };
};

//async action creater

//Action Creater
const changeNickanme = (data) => {
  return {
    type: "CHANGE_NICKNAME",
    data,
  };
};
changeNickanme("boogicho");

// const changeNickanme = {
//   type: "CHANGE_NICKNAME",
//   data: "boogicho",
// };

// const changeNickanme = {
//   type: "CHANGE_NICKNAME",
//   data: "neue zeal",
// };

//(이전상태, 액션) => 다음상태를 만든다.
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    // case "CHANGE_NICKNAME":
    //   return {
    //     ...state,
    //     name: action.data,
    //   };
    case HYDRATE:
      console.log("HYDRATE", action);
      return {
        ...state,
        ...action.payload,
      };
    case "LOG_IN":
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: true,
          user: action.data,
        },
      };
    case "LOG_OUT":
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: false,
          user: null,
        },
      };
    default:
      return state;
  }
};

export default rootReducer;
