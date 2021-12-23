<template>
   <div>
    <v-textarea
      v-model="testString"
    >

    </v-textarea>
    <v-data-table 
        dense
        :headers="galleriesHeaders" 
        :items="galleries" 
        class="elevation-1"
        show-select
        v-model="selectedGalleries"
      >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Список альбомов</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="ma-1" color="primary" small @click="getPhotos">
            Получить фото  
          </v-btn>
          <v-btn class="ma-1" color="primary" small @click="parseDescription">
            Парсить строку  
          </v-btn>
        </v-toolbar>
      </template>

    </v-data-table>
   </div>
</template>

<script>
export default {
  name: "GalleryList",

  created () {
    this.getGalleries()    
  },

  data:()=>({
    selectedGalleries:[],
    galleries: [],
    galleriesHeaders: [
      { text: 'id', value: 'id' },
      { text: 'thumb_id', value: 'thumb_id' },
      { text: 'owner_id', value: 'owner_id' },
      { text: 'title', value: 'title' },
      { text: 'description', value: 'description'},
      { text: 'created', value: 'created', align: 'center' },
      { text: 'updated', value: 'updated', align: 'center' },
      { text: 'size', value: 'size' },
    ],
    photos:[],
    testString:`Код товара : 9307\n Ткань : Велюр ( халат с поясом )\nЦвет : Чёрный, мокко , бирюза , серый , сиреневый.\nЦена : 360 грн
Размер : единый 42-46 рр
(р 845)
(o 845)
( 845)
р 845`,
  }),

  methods: {
    getGalleries(){
      this.$store
        .dispatch("get_galleries"
        // ,{
        //   owner_id: owner_id
        // }
        )
        .then(() => {
          this.galleries = this.$store.getters.galleries;
          console.log("Ok");
        })
        .catch((error) => {
          console.error(error);
          return;
        });
    },
    getPhotos(){
      const galleryIDs = Array.from(this.selectedGalleries,(gl)=>String(gl.id))
      console.log(galleryIDs);
      this.$store
        .dispatch("get_photos", 
          galleryIDs)
        .then(() => {
          this.photos = this.$store.getters.photos;
          console.log("Photos ok!");
          console.log(Array.from(this.photos,(ph)=>String(ph.text)));
        })
        .catch((error) => {
          console.error(error);
          return;
        });
    },
    parseDescription(description){
      console.log(description);

      const conteinerRegexp = /\(.\s\d{1,4}\)/
      let conteinerMatch = conteinerRegexp.exec(this.testString)
      // let s = this.testString.match(conteinerRegexp)
      const [container] = conteinerMatch 
      console.log(container);
      // console.log(regex.test(this.testString));

      const pricestrRegexp = /(Цена)(\s*)(.)(\s*)(\d{1,5})(\s*)грн/
      let pricestrMatch = pricestrRegexp.exec(this.testString)
      const [pricestr] = pricestrMatch 
      console.log(pricestr);

      const priceRegexp = /\d+/
      let priceMatch = priceRegexp.exec(pricestr)
      const [price] = priceMatch 
      console.log(price);

      const modelRegexp = /(мод|(код товара))(\s*)(.*)(\s*)(\d{1,5})(\s*)([А-я]*)(\s*)/i
      let modelstrMatch = modelRegexp.exec(this.testString)
      console.log(modelstrMatch);
      const [modelstr] = modelstrMatch 
      console.log(modelstr);

      const modelArray = modelstr.trim().split(" ");
      console.log(modelArray);
      if (modelArray.length) {
        const productname = modelArray[modelArray.length - 1]
        console.log("Name: ", productname);
      }
    }
  }
};
</script>

<style scoped>

</style>
