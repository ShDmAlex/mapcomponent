<template>
  <div class="map-container">
    <MapSvg
      :viewBox="currentViewBox"
      class="svg-map"
      @click="handleSvgClick"
      @mouseenter="handleSvgMouseEnter"
      @mouseleave="hideTooltip"
    />
    <div
       v-if="tooltipVisible"
      class="tooltip"
      :class="{ 'tooltip-small': tooltipType === 'reset' }"
      :style="{ left: tooltipX, top: tooltipY }"
      v-html="tooltipHtml"
  ></div>
    <button 
    v-if="selectedRegion !== null" 
    class="reset-btn" 
    @click="resetToDefault" 
    @mouseenter="showTooltip('Вся область', $event)"
    @mouseleave="hideTooltip">
      <i class="fa-solid fa-earth-americas"></i>
    </button>
  </div>
</template>

<script>
import MapSvg from '@/assets/map.svg';
export default {
  components: {
    MapSvg,
  },
  props: {
    regionItems: {
      type: Array,
      required: true,
      default: () => [],
    },
    pathDataCustomizationMethod: {
      type: Function,
      required: true,
    },
    textDataCustomizationMethod: {
      type: Function,
      required: true,
    },
    zoomOnSelect: {
    type: Boolean,
    default: true, 
  },
  },
  data() {
    return {
      selectedRegion: null,
      tooltipVisible: false,
      tooltipType: 'region',
      tooltipText: '',
      tooltipHtml: '',
      tooltipX: 0,
      tooltipY: 0,
      defaultViewBox: '0 0 29252.3 16557.2',
      currentViewBox: '0 0 29252.3 16557.2',
      zoomLevel: 1,
    };
  },
  computed: {
    regionStyles() {
      return this.pathDataCustomizationMethod(this.regionItems);
    },
    regionTexts() {
      return this.textDataCustomizationMethod(this.regionItems);
    },
  },
  mounted() {
    this.applyStylesAndTexts();
    this.updateSvgClasses();
    this.addEventListeners();
  },
  methods: {
addEventListeners() {
  const svg = this.$el.querySelector('.svg-map');
  if (!svg) return;

  const paths = svg.querySelectorAll('path');
  paths.forEach((path) => {
    path.addEventListener('click', () => {
      const regionId = this.getRegionIdFromClass(path);
      if (regionId) {
        this.selectRegion(regionId);
      }
    });
    path.addEventListener('mouseenter', (event) => {
      const regionId = this.getRegionIdFromClass(path);
      const region = this.regionItems.find((r) => {
        if (regionId === '1-city') {
          return String(r.id) === '1-city';
        }
        return String(r.id) === regionId;
      });
      this.showTooltip(region, event);
    });
    path.addEventListener('mouseleave', () => {
      this.hideTooltip();
    });
  });

  const texts = svg.querySelectorAll('text');
  texts.forEach((text) => {
    text.addEventListener('click', () => {
      const regionId = this.getRegionIdFromClass(text);
      if (regionId) {
        this.selectRegion(regionId);
      }
    });
    text.addEventListener('mouseenter', (event) => {
      const regionId = this.getRegionIdFromClass(text);
      const region = this.regionItems.find((r) => {
        if (regionId === '1-city') {
          return String(r.id) === '1-city';
        }
        return String(r.id) === regionId;
      });
      this.showTooltip(region, event);
    });
    text.addEventListener('mouseleave', () => {
      this.hideTooltip();
    });
  });
},
handleSvgClick(event) {
      const path = event.target.closest('path');
      if (path) {
        const regionId = this.getRegionIdFromClass(path);
        if (regionId) {
          this.selectRegion(regionId);
        }
      }
    },
    handleSvgMouseEnter(event) {
  const target = event.target.closest('path') || event.target.closest('text');
  if (target && !target.classList.contains('hidden')) {
    const regionId = this.getRegionIdFromClass(target);
    const region = this.regionItems.find((r) => {
      if (regionId === '1-city') {
        return String(r.id) === '1-city';
      }
      return String(r.id) === regionId;
    });
    this.showTooltip(region, event);
  }
},
getRegionIdFromClass(element) {
      const classList = element.classList;
      const filClass = Array.from(classList).find((cls) => cls.startsWith('fil'));
      let regionId = filClass ? filClass.replace('fil', '') : null;
      if (classList.contains('fnt-city') && regionId) {
        regionId = `${regionId}-city`;
      }
      return regionId;
    },
applyStylesAndTexts() {
      const svg = this.$el.querySelector('.svg-map');
      if (!svg) return;
      const paths = svg.querySelectorAll('path');
      paths.forEach((path) => {
        const regionId = this.getRegionIdFromClass(path);
        if (regionId && this.regionStyles[regionId]) {
          path.style.fill = this.regionStyles[regionId];
        } else {
          path.style.fill = '#ccc'; 
        }
      });
      const texts = svg.querySelectorAll('text');
      texts.forEach((text) => {
        const regionId = this.getRegionIdFromClass(text);
        if (regionId && this.regionTexts[regionId]) {
          text.textContent = this.regionTexts[regionId];
        } else {
          text.textContent = '';
        }
      });
    },
selectRegion(regionId) {
  this.selectedRegion = regionId;
  if (this.zoomOnSelect) {
    this.centerRegion(regionId);
  }
  this.updateSvgClasses();
  const region = this.regionItems.find((r) => {
    if (regionId === '1-city') {
      return String(r.id) === '1-city';
    }
    return String(r.id) === regionId;
  });
  const regionDataId = region ? region.id : null;
  console.log(`regionId: ${regionId}, regionDataId: ${regionDataId}`);
  this.$emit('region-selected', regionDataId);
},
resetToDefault() {
  this.selectedRegion = null;
  if (this.zoomOnSelect) {
    this.currentViewBox = this.defaultViewBox;
    this.zoomLevel = 1;
    this.updateSvgViewBox();
  }
  this.updateSvgClasses();
  this.$emit('region-selected', null);
},
centerRegion(regionId) {
      const svg = this.$el.querySelector('.svg-map');
      let path;
      if (regionId === '1-city') {
        path = svg.querySelector(`.fil1`);
      } else {
        path = svg.querySelector(`.fil${regionId}`);
      }
      if (path) {
        const bbox = path.getBBox();
        const container = this.$el.querySelector('.map-container');
        let zoomFactor = regionId === '1-city' ? 3 : 1.7;
        if (container) {
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          zoomFactor = Math.min(containerWidth / bbox.width, containerHeight / bbox.height);
        }
        const newWidth = bbox.width * zoomFactor;
        const newHeight = bbox.height;
        const centerX = bbox.x + bbox.width / 2;
        const centerY = bbox.y + bbox.height / 2;
        const newX = centerX - newWidth / 2;
        const newY = centerY - newHeight / 2;
        this.currentViewBox = `${newX} ${newY} ${newWidth} ${newHeight}`;
        this.zoomLevel = zoomFactor;
      }
    },
updateSvgViewBox() {
  const svg = this.$el.querySelector('.svg-map');
  if (svg) {
    svg.setAttribute('viewBox', this.currentViewBox);
  }
},
isElementVisible(regionId) {
      if (this.selectedRegion === null) {
        return true;
      }
      if (regionId === this.selectedRegion) {
        return true;
      }
      if (this.selectedRegion === '1-city' && regionId === '1') {
        return true;
      }
      return false;
    },
updateSvgClasses() {
  const svg = this.$el.querySelector('.svg-map');
  if (!svg) return;
  const isElementVisible = (regionId) => {
    if (!this.zoomOnSelect) {
      return true;
    }
    if (this.selectedRegion === null) {
      return true;
    }
    if (regionId === this.selectedRegion) {
      return true;
    }
    if (this.selectedRegion === '1-city' && regionId === '1') {
      return true;
    }
    return false;
  };
  const paths = svg.querySelectorAll('path');
  paths.forEach((path) => {
    const regionId = this.getRegionIdFromClass(path);
    const shouldBeVisible = isElementVisible(regionId);
    path.classList.toggle('hidden', !shouldBeVisible);
    if (!this.zoomOnSelect && regionId === this.selectedRegion) {
      path.classList.add('selected');
    } else {
      path.classList.remove('selected');
    }
  });
  const texts = svg.querySelectorAll('text');
  texts.forEach((text) => {
    const regionId = this.getRegionIdFromClass(text);
    const shouldBeVisible = isElementVisible(regionId);
    if (shouldBeVisible) {
      text.classList.remove('hidden');
      if (regionId && this.regionTexts[regionId]) {
        text.textContent = this.regionTexts[regionId];
      }
      if (!this.zoomOnSelect && regionId === this.selectedRegion) {
        text.classList.add('selected');
      } else {
        text.classList.remove('selected');
      }
    } else {
      text.classList.add('hidden');
    }
  });
},
showTooltip(text, event) {
  if (typeof text === 'string') {
    this.tooltipType = 'reset';
    this.tooltipHtml = `<div class="tooltip-content">${text}</div>`;
    this.tooltipVisible = true;
    this.tooltipX = event.clientX;
    this.tooltipY = event.clientY;
    return;
  }
  this.tooltipType = 'region';
  const region = text;
  const regionName = region.name;
  const fertility2023 = region.fertility['2023'];
  const fertility2024 = region.fertility['2024'];
  const mortality2023 = region.mortality['2023'];
  const mortality2024 = region.mortality['2024'];
  let fertilityTrend = '';
  let fertilityIconClass = '';
  const fert2023 = parseFloat(fertility2023);
  const fert2024 = parseFloat(fertility2024);
  if (fert2024 < fert2023) {
    fertilityTrend = '▼';
    fertilityIconClass = 'fertility-icon';
  } else {
    fertilityTrend = '▲';
    fertilityIconClass = 'mortality-icon';
  }
  let mortalityTrend = '';
  let mortalityIconClass = '';
  const mortal2023 = parseFloat(mortality2023);
  const mortal2024 = parseFloat(mortality2024);
  if (mortal2024 < mortal2023) {
    mortalityTrend = '▼';
    mortalityIconClass = 'mortality-icon';
  } else {
    mortalityTrend = '▲';
    mortalityIconClass = 'fertility-icon';
  }
  this.tooltipHtml = `
    <div class="tooltip-content">
      <div class="tooltip-title">${regionName}</div>
      <div class="tooltip-section">
        <span class="tooltip-label">Рождаемость</span><br>
        <span class="tooltip-year">2023г. - ${fertility2023}</span>
        <div class="tooltip-year-with-icon">
          <span class="tooltip-year">2024г. - ${fertility2024}</span>
          <span class="tooltip-icon ${fertilityIconClass}">${fertilityTrend}</span>
        </div>
      </div>
      <div class="tooltip-section">
        <span class="tooltip-label">Смертность</span><br>
        <span class="tooltip-year">2023г. - ${mortality2023}</span>
        <div class="tooltip-year-with-icon">
          <span class="tooltip-year">2024г. - ${mortality2024}</span>
          <span class="tooltip-icon ${mortalityIconClass}">${mortalityTrend}</span>
        </div>
      </div>
    </div>
  `;
  this.tooltipVisible = true;
  this.tooltipX = event.clientX;
  this.tooltipY = event.clientY;
},
hideTooltip() {
      this.tooltipVisible = false;
      this.tooltipType = 'region';
    },
  },
  watch: {
selectedRegion() {
      this.updateSvgClasses();
    },
    regionItems: {
      handler() {
        this.applyStylesAndTexts();
      },
      deep: true,
    },
  },
};
</script>