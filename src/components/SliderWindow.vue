<template>
  <div class="slider-wrapper">
    <v-window v-model="currentPage" touchless>
      <v-window-item :value="0">
        <div class="grid-container first-page">
          <slot name="page1"></slot>
        </div>
      </v-window-item>
      <v-window-item :value="1">
        <div class="grid-container second-page">
          <slot name="page2"></slot>
        </div>
      </v-window-item>
    </v-window>
    <div class="page-navigation" :class="{ 'on-right': isButtonOnRight, 'on-left': !isButtonOnRight }">
      <v-btn
        class="nav-btn"
        color="#ffffff00"
        width="40px"
        height="40px"
        fab
        @click="navigate"
      >
        <v-icon color="#fff" size="20">
          {{ isButtonOnRight ? 'fas fa-chevron-right' : 'fas fa-chevron-left' }}
        </v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SliderWindow',
  data() {
    return {
      currentPage: 0,
      isButtonOnRight: true,
    };
  },
  methods: {
    navigate() {
      this.currentPage = this.currentPage === 0 ? 1 : 0;
      this.isButtonOnRight = !this.isButtonOnRight;
    },
  },
};
</script>