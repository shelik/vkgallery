import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    galleries:[],
    photos:[],
  },
  
  mutations: {
    update_state_field(state, value) {
      state[value.field] = value.data;
    },
  },

  actions: {  
    get_galleries({
      commit
    }) {
      return new Promise((resolve, reject) => {
        Axios({
            url: "/api/get_galleries",
            method: "GET",
            params: {
              // owner_id: "id375401475",
              owner_id: "23933287",
            },
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'}  
          }).then((res) => {
            console.log(res.data);
            commit("update_state_field", {
              field: "galleries", 
              data: res.data,
            });
            resolve(res);
          })
          .catch((error) => {
            if (error.response.status === 401) {
              commit("logout")
            }
            reject(error)
          });
      });
    },
  },

  getters: {
    galleries:(state) => state.galleries,
  },

  modules: {},
});
