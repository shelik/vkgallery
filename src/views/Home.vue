<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld,
  },
  data:()=>{

  },
  created () {  
    this.getGalleries();    
  },
  methods: {
    getGalleries(){
      this.$store
        .dispatch("get_galleries"
        // ,{
        //   owner_id: owner_id
        // }
        )
        .then(() => {
          console.log("Ok");
        })
        .catch((error) => {
          console.error(error);
          return;
        });
    },
    getByCORS(){
      var script = document.createElement('SCRIPT');
      script.src = "https://api.vk.com/method/users.get?user_ids=23933287&fields=bdate&v=5.131&callback=callbackFunc";
      document.getElementsByTagName("head")[0].appendChild(script);
      function callbackFunc(result) {
        alert(result.response[0].first_name)
      }
      console.log(callbackFunc);
    }, 
    callbackFunc(result) {
      alert(result.response[0].first_name)
    },


  }

};
function callbackFunc(result) {
  alert(result.response[0].first_name)
}
console.log(callbackFunc);

</script>
