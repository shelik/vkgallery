<template>
  <div>
    <v-row class="pa-10">
      <v-col cols="4">
        <v-text-field
          class="pl-8 pr-8"
          label="ID пользователя"
          hint="ID пользователя"
          persistent-hint
          solo
          v-model="ownerID"
        >
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          class="pl-8 pr-8"
          label="Токен приложения"
          hint="Токен приложения"
          persistent-hint
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
          <v-btn class="ma-1" color="primary" small @click="getGalleries">
            Получить альбомы
          </v-btn>
          <v-btn class="ma-1" color="primary" small @click="getPhotos">
            Получить фото
          </v-btn>
          <!-- <v-btn class="ma-1" color="primary" small @click="parseDescription">
            Парсить строку
          </v-btn> -->
        </v-toolbar>
      </template>
    </v-data-table>
    <v-dialog v-model="show" max-width="80%">
      <v-card>
        <v-system-bar color="blue darken-2" dark>
          <span class="generator-title"
            >Выгрузка фотографий альбомов: {{ galleryIDsrt }}</span
          >
          <v-spacer></v-spacer>
          <v-icon @click.stop="show = false">mdi-close</v-icon>
        </v-system-bar>

        <v-card-text>
          <v-container fluid>
            <v-data-table
              dense
              hide-default-footer
              :items="products"
              :headers="productHeaders"
              :options="{ itemsPerPage: -1 }"
              show-select
              v-model="selectedPhotos"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Список фотографий</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn class="ma-1" color="primary" small @click="exportCSV">
                    Выгрузить
                  </v-btn>
                  <!-- <v-btn class="ma-1" color="primary" small @click="parseDescription">
                    Парсить строку
                  </v-btn> -->
                </v-toolbar>
              </template>

              <template v-slot:[`item.text`]="{ item }">
                <v-textarea
                  dense
                  class="pa-1 ma-1 clear-table-input-field"
                  v-model="item.text"
                  @change="parseItem(item)"
                >
                </v-textarea>
              </template>
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

import Config from "../config";
export default {
  name: "GalleryList",

  created() {
    this.ownerID = Config.OWNER_ID;
    this.token = Config.TOKEN;
    this.getGalleries();
  },

  data: () => ({
    ownerID: "",
    token: "",
    selectedGalleries: [],
    selectedPhotos: [],
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
      { text: "album_id", value: "album_id" },
      { text: "Артикул", value: "vencode" },
      { text: "Наименование", value: "name" },
      { text: "Цена", value: "price" },
      { text: "Контейнер", value: "container" },
      { text: "Описание", value: "text" },
    ],
    galleryIDsrt: "",
    show: false,
    exportTable: [
      {
        vencode: "Артикул",
        name: "Найменування",
        unit: "Одиниця виміру",
        strength: "Міцність (для ТТН)",
        ratePDV: "Ставка ПДВ",
        rateAP: "Ставка АП",
        packaging: "Вид пакування вантажу",
        type: "Тип",
        price: "Ціна",
        codeUKTZED: "Код УКТЗЕД",
        import: "Ознака імп товару",
        barcode: "Штрих-код",
        barcode2: "Штрих-код2",
        group: "Група",
      },
    ],

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
      this.galleries.length = 0;
      this.$store
        .dispatch("get_galleries", {
          owner_id: this.ownerID,
          token: this.token,
        })
        .then(() => {
          if (this.$store.getters.galleries) {
            this.galleries = this.$store.getters.galleries;
          }
          console.log("Galleries Ok");
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
      // console.log(galleryIDs);
      console.log(
        "Photos Max count",
        Math.max(
          ...Array.from(this.selectedGalleries, (gl) => parseInt(gl.size))
        )
      );

      this.$store
        .dispatch("get_photos", {
          gallery_ids: galleryIDs,
          owner_id: this.ownerID,
          token: this.token,
          count: Math.max(
            ...Array.from(this.selectedGalleries, (gl) => parseInt(gl.size))
          ),
        })
        .then(() => {
          this.photos = this.$store.getters.photos;

          console.log(
            "Photos ok! Max count",
            Math.max(
              ...Array.from(this.selectedGalleries, (gl) => parseInt(gl.size))
            )
          );

          this.openPhotos();
          // console.log(Array.from(this.photos, (ph) => String(ph.text)));
        })
        .catch((error) => {
          console.error(error);
          return;
        });
    },
    openPhotos() {
      console.log(this.photos);
      this.photos.forEach((ph) => {
        this.addProduct(ph);
      });
      this.show = true;
    },

    parseProduct(product) {
      const description = product.text;

      const conteinerRegexp = /\(.\s*\d{1,4}\)/;
      let conteinerMatch = conteinerRegexp.exec(description);
      // let s = this.testString.match(conteinerRegexp)
      let container = "";
      if (conteinerMatch) {
        [container] = conteinerMatch;
      }
      // console.log(container);
      // console.log(regex.test(this.testString));

      const pricestrRegexp = /(Цена)(\s*)(.)(\s*)(\d{1,5})(\s*)грн/;
      let pricestrMatch = pricestrRegexp.exec(description);
      let pricestr = "";
      if (pricestrMatch) {
        [pricestr] = pricestrMatch;
      }
      // console.log(pricestr);

      const priceRegexp = /\d+/;
      let priceMatch = priceRegexp.exec(pricestr);
      let price = "";
      if (priceMatch) {
        [price] = priceMatch;
      }
      // console.log(price);

      const modelstrRegexp =
        /^[\bМод\b]*[\BМодель\B]*[\BКод товара\B]*[\s]*[\.]*[\:]*[\№]*[№\.]*[\s]*\d{1,5}[\.]*\s+[А-я]+/i;
      // /(модель|мод|(код товара))(\s*)(.*)(\s*)(\d{1,5})\s(([А-я]*)(\s*))/i;
      let modelstrMatch = modelstrRegexp.exec(description);
      // console.log(modelstrMatch);
      let modelstr = "";
      if (modelstrMatch) {
        [modelstr] = modelstrMatch;
      }
      console.log(modelstr);
      const nameRegexp = /\d{1,5}[\s]*\D+/;
      let nameMatch = nameRegexp.exec(modelstr);
      console.log(nameMatch);
      var name = "";
      if (nameMatch) {
        [name] = nameMatch;
      }
      // console.log("Vencode: ", model);

      const modelRegexp = /(\d+)/;
      let modelMatch = modelRegexp.exec(modelstr);
      var model = "";
      if (modelMatch) {
        [model] = modelMatch;
      }
      // console.log("Vencode: ", model);

      // const modelArray = modelstr.trim().split(" ");
      // console.log(modelArray);
      // var name = "";
      // if (modelArray.length) {
      //   name = modelArray[modelArray.length - 1];

        // const nameRegexp = /(\W+)/;
        // let nameMatch = nameRegexp.exec(productname);
        // var name = "";
        // if (nameMatch) {
        //   [name] = nameMatch;
        // }
        // console.log("Name: ", name.trim());
      // }
      return {
        id: product.id,
        album_id: product.album_id,
        vencode: model,
        name: name,
        // name: modelstr,
        price: price,
        container: container,
        text: product.text,
      };
    },

    addProduct(product) {
      this.products.push(this.parseProduct(product));
    },

    save() {},

    parseItem(item) {
      const editedIndex = this.products.findIndex((el) => el.id === item.id);
      const parsedItem = this.parseProduct(item);
      this.products.splice(editedIndex, 1, parsedItem);
    },
    exportCSV() {
      let vencode = localStorage.getItem("last_vencode");
      if (!vencode) {
        vencode = 1;
      }
      this.exportTable.length = 1;
      this.selectedPhotos.forEach((photo) => {
        this.exportTable.push({
          vencode: vencode,
          name: photo.name,
          unit: "шт",
          strength: "0",
          ratePDV: "0",
          rateAP: "",
          packaging: "",
          type: "0",
          price: photo.price,
          codeUKTZED: "",
          import: "0",
          barcode: "",
          barcode2: "0",
          group: photo.container,
        });
        vencode++;
      });
      localStorage.setItem("last_vencode",vencode)

      var win = window.open();
      let strHTML = "data:text/csv;charset=utf-8,";
      this.exportTable.forEach((element) => {
        strHTML = strHTML + `${element.vencode};${element.name};${element.unit};${element.strength};${element.ratePDV};${element.rateAP};${element.packaging};${element.type};${element.price};${element.codeUKTZED};${element.import};${element.barcode};${element.barcode2};${element.group};
`;
      });
      var encodedUri = encodeURI(strHTML);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "my_data.csv");
      document.body.appendChild(link); 
      link.click();
      console.log(strHTML);
      // win.document.write(strHTML);
    },
  },
};
</script>

<style scoped></style>
