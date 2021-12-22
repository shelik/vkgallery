<template>
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
      </v-toolbar>
    </template>

   </v-data-table>
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

  }
};
</script>

<style scoped>

</style>
