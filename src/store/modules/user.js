import { loginApi, getInfoApi } from "@/api/user";
import { setToken, getToken, removeToken } from "@/utils/auth";

const state = {
  // token
  token: getToken() || "",
  userInfo: null,
};

const mutations = {
  // 设置token
  setToken(state, token) {
    // 存储到vuex
    state.token = token;
    // 存储到cookie
    setToken(token);
  },
  setUserInfo(state, userInfo) {
    // 存储vuex
    state.userInfo = userInfo;
  },
  removeToken() {
    state.token = "";
    state.userInfo = null;
    removeToken();
  },
};

const actions = {
  // 登录
  async login({ commit }, { username, password }) {
    try {
      // 调用登录接口
      const { data } = await loginApi({ username, password });

      // 存储token
      commit("setToken", data.token);
    } catch (error) {
      console.log(error);
    }
  },
  // 获取用户信息
  async userInfo({ commit }) {
    try {
      // 调用获取用户信息接口
      const { data } = await getInfoApi();
      console.log("Res==>", data);
      // 存储token
      commit("setUserInfo", data);
    } catch (error) {
      console.log(error);
    }
  },
  // 退出登录
  async logout({ commit }) {
    try {
      // 移除token
      commit("removeToken");
    } catch (error) {
      console.log(error);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }
