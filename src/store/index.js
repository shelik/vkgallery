import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    galleries: [],
    photos: [],
  },

  mutations: {
    update_state_field(state, value) {
      state[value.field] = value.data;
    },
  },

  actions: {
    get_galleries({ commit }, data) {
      return new Promise((resolve, reject) => {
        Axios({
          url: "/api/get_galleries",
          method: "GET",
          params: {
            // owner_id: "223454694",
            owner_id: data.owner_id,
            token: data.token,
          },
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
          .then((res) => {
            commit("update_state_field", {
              field: "galleries",
              data: res.data,
            });
            resolve(res);
          })
          .catch((error) => {
            if (error.response.status === 401) {
              commit("logout");
            }
            reject(error);
          });
      });
    },
    get_photos({ commit }, data) {
      return new Promise((resolve, reject) => {
        Axios({
          url: "/api/get_photos",
          method: "POST",
          data: {
            gallery_ids: data.gallery_ids,
            owner_id: data.owner_id,
            token: data.token,
            count: data.count,
          },
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
          .then((res) => {
            console.log(res.data);
            commit("update_state_field", {
              field: "photos",
              data: res.data,
            });
            resolve(res);
          })
          .catch((error) => {
            if (error.response.status === 401) {
              commit("logout");
            }
            reject(error);
          });
      });
    },
  },

  getters: {
    galleries: (state) => state.galleries,
    photos: (state) => state.photos,
  },

  modules: {},
});
