<template>
  <div class="page-wrapper">
    <v-window
      show-arrows
      class="content-window-slider">
      <template v-slot:prev="{ on, attrs }">
        <v-btn
          dark
          text
          fab
          absolute
          height="40"
          width="40"
          v-bind="attrs"
          v-on="on"
          class="custom-prev-btn">
          <v-icon>fa-chevron-left</v-icon>
        </v-btn>
      </template>
      <template v-slot:next="{ on, attrs }">
        <v-btn
          dark
          text
          fab
          absolute
          height="40"
          width="40"
          v-bind="attrs"
          v-on="on"
          class="custom-next-btn">
          <v-icon>fa-chevron-right</v-icon>
        </v-btn>
      </template>
      <v-window-item>
        <first-slide/>
      </v-window-item>
      <v-window-item>
        <second-slide/>
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import FirstSlide from './Slides/FirstSlide.vue';
import SecondSlide from './Slides/SecondSlide.vue';

export default {
  name: 'MapCard',
  components: {
    FirstSlide,
    SecondSlide,
  },
};
</script>