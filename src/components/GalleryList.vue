<template>
  <div>
    <!-- <v-textarea v-model="testString"> </v-textarea> -->
    <v-row>
      <v-col>
        <v-text-field
          class="pl-8 pr-8"
          label="ID пользователя"
          solo
          v-model="ownerID"
        >
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          class="pl-8 pr-8"
          label="Токен приложения"
          solo
          v-model="token"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      dense
      :headers="galleriesHeaders"
      :items="galleries"
      class="elevation-1"
      show-select
      v-model="selectedGalleries"
    >
      <template v-slot:top>
        <v-toolbar flat>
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
    <v-dialog v-model="show" max-width="1000px">
      <v-card>
        <v-system-bar color="blue darken-2" dark>
          <span class="generator-title"
            >Выгрузка фотографий альбомов: {{
          }}</span>
          <v-spacer></v-spacer>
          <v-icon @click="close">mdi-close</v-icon>
        </v-system-bar>

        <v-card-text>
          <v-container fluid>
            <v-data-table
              dense
              hide-default-footer
              :items="products"
              :headers="productHeaders"
              :options="{ itemsPerPage: -1 }"
            >
            </v-data-table>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click.stop="show = false">
            Отменить
          </v-btn>
          <v-btn color="blue darken-1" text @click="save"> Сохранить </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/* eslint-disable */

export default {
  name: "GalleryList",

  created() {
    this.getGalleries();
  },

  data: () => ({
    ownerID: "",
    token: "",
    selectedGalleries: [],
    galleries: [],
    galleriesHeaders: [
      { text: "id", value: "id" },
      { text: "thumb_id", value: "thumb_id" },
      { text: "owner_id", value: "owner_id" },
      { text: "title", value: "title" },
      { text: "description", value: "description" },
      { text: "created", value: "created", align: "center" },
      { text: "updated", value: "updated", align: "center" },
      { text: "size", value: "size" },
    ],
    photos: [],
    products: [],
    productHeaders: [
      { text: "id", value: "id" },
      { text: "id", value: "id" },
      { text: "id", value: "id" },
      { text: "id", value: "id" },
      { text: "id", value: "id" },
      { text: "id", value: "id" },
    ],
    galleryIDsrt: "",

    testString: `Код товара : 9307
Ткань : Велюр ( халат с поясом )
Цвет : Чёрный, мокко , бирюза , серый , сиреневый.
Цена : 360 грн
Размер : единый 42-46 рр
(р 845)
(o 845)
( 845)
р 845`,
  }),

  methods: {
    getGalleries() {
      this.$store
        .dispatch("get_galleries", {
          owner_id: ownerID,
          token: token,
        })
        .then(() => {
          this.galleries = this.$store.getters.galleries;
          console.log("Ok");
        })
        .catch((error) => {
          console.error(error);
          return;
        });
    },

    getPhotos() {
      const galleryIDs = Array.from(this.selectedGalleries, (gl) =>
        String(gl.id)
      );
      this.galleryIDsrt = galleryIDs.toString();
      console.log(galleryIDs);
      this.$store
        .dispatch("get_photos", {
          gallery_ids: galleryIDs,
          owner_id: ownerID,
          token: token,
        })
        .then(() => {
          this.photos = this.$store.getters.photos;
          console.log("Photos ok!");
          console.log(Array.from(this.photos, (ph) => String(ph.text)));
        })
        .catch((error) => {
          console.error(error);
          return;
        });
    },
    parseDescription(description) {
      console.log(description);

      const conteinerRegexp = /\(.\s\d{1,4}\)/;
      let conteinerMatch = conteinerRegexp.exec(this.testString);
      // let s = this.testString.match(conteinerRegexp)
      const [container] = conteinerMatch;
      console.log(container);
      // console.log(regex.test(this.testString));

      const pricestrRegexp = /(Цена)(\s*)(.)(\s*)(\d{1,5})(\s*)грн/;
      let pricestrMatch = pricestrRegexp.exec(this.testString);
      const [pricestr] = pricestrMatch;
      console.log(pricestr);

      const priceRegexp = /\d+/;
      let priceMatch = priceRegexp.exec(pricestr);
      const [price] = priceMatch;
      console.log(price);

      const modelstrRegexp =
        /(мод|(код товара))(\s*)(.*)(\s*)(\d{1,5})\s(([А-я]*)(\s*))/i;
      let modelstrMatch = modelstrRegexp.exec(this.testString);
      console.log(modelstrMatch);
      const [modelstr] = modelstrMatch;
      console.log(modelstr);

      const modelArray = modelstr.trim().split(" ");
      console.log(modelArray);
      if (modelArray.length) {
        const productname = modelArray[modelArray.length - 1];
        const modelRegexp = /(\d+)/;
        let modelMatch = modelRegexp.exec(productname);
        const [model] = modelMatch;
        console.log("Vencode: ", model);

        const nameRegexp = /(\W+)/;
        let nameMatch = nameRegexp.exec(productname);
        const [name] = nameMatch;
        console.log("Name: ", name.trim());
      }
    },
  },
};
</script>

<style scoped></style>
