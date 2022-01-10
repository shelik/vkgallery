<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn text @click="openSettings">
        <span class="mr-2">Настройки</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
    <v-dialog v-model="settingsDialog" max-width="300px">
      <v-card>
        <v-system-bar color="blue darken-2" dark>
          <span class="generator-title">Настройки</span>
          <v-spacer></v-spacer>
          <v-icon @click.stop="settingsDialog = false">mdi-close</v-icon>
        </v-system-bar>

        <v-card-text>
          <v-container fluid>
            <v-text-field
              label="Начинать нумерацию товаров с:"
              filled
              v-model.number="lastID"
            >
            </v-text-field>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click.stop="settingsDialog = false"
          >
            Отменить
          </v-btn>
          <v-btn color="blue darken-1" text @click="save"> Сохранить </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    settingsDialog: false,
    lastID: 0,
  }),

  created() {
    this.lastID = localStorage.getItem("last_vencode");
  },

  methods: {
    openSettings() {
      this.lastID = localStorage.getItem("last_vencode");
      this.settingsDialog = true;
    },

    save() {
      localStorage.setItem("last_vencode", this.lastID);
      this.settingsDialog = false;
    },
  },
};
</script>
