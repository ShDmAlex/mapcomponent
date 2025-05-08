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
      :class="{ 'tooltip-small': tooltipType === 'reset', 'tooltip-centered': tooltipCentered }"
      :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
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
  tooltipHtmlExternal: {
    type: String,
    default: '',
  },
  tooltipEvent: {
    type: Object,
    default: null,
  },
  },
  data: function() {
    return {
      selectedRegion: null,
      tooltipVisible: false,
      tooltipHtml: '',
      tooltipType: 'region',
      tooltipX: 0,
      tooltipY: 0,
      tooltipCentered: false,
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
showTooltip: function(text, event) {
      // Проверяем, что text - это строка или объект региона
      if (typeof text !== 'string' && !text) {
        console.error('Invalid tooltip data:', text);
        this.hideTooltip();
        return;
      }

      // Если text - это строка (например, "Вся область"), используем её напрямую
      const isResetTooltip = typeof text === 'string' && text.includes('Вернуть');
      this.tooltipType = isResetTooltip ? 'reset' : 'region';

      // Если text - это объект региона, передаем его в родительский компонент через событие
      if (typeof text !== 'string') {
        this.$emit('tooltip-show', { region: text, event });
        return;
      }

      const tooltipWidth = this.tooltipType === 'reset' ? 90 : 220;
      const tooltipHeight = this.tooltipType === 'reset' ? 40 : 140;
      const offsetX = 10;
      const offsetY = 10;

      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const windowHeight = window.innerHeight;

      let tooltipX;
      this.tooltipCentered = mouseX < tooltipWidth + offsetX;
      if (this.tooltipCentered) {
        tooltipX = mouseX - tooltipWidth / 2;
      } else {
        tooltipX = mouseX - tooltipWidth - offsetX;
      }
      tooltipX = Math.max(0, tooltipX);

      let tooltipY = mouseY + offsetY;
      if (tooltipY + tooltipHeight > windowHeight) {
        tooltipY = mouseY - tooltipHeight - offsetY;
      }
      tooltipY = Math.max(0, tooltipY);

      this.tooltipX = tooltipX;
      this.tooltipY = tooltipY;

      this.tooltipHtml = text;
      this.tooltipVisible = true;
    },
    hideTooltip: function() {
      this.tooltipVisible = false;
      this.tooltipType = 'region';
      this.tooltipHtml = '';
    },
    handleMouseOver: function(region, event) {
      this.$emit('tooltip-show', { region, event });
    },
    handleMouseMove: function(event) {
      if (this.tooltipHtml) {
        this.showTooltip(this.tooltipHtml, event);
      }
    },
  },
  watch: {
selectedRegion() {
      this.updateSvgClasses();
    },
    tooltipHtmlExternal: function(newHtml) {
      if (newHtml && this.tooltipEvent) {
        this.showTooltip(newHtml, this.tooltipEvent);
      }
    },
    tooltipEvent: function(newEvent) {
      if (newEvent && this.tooltipHtmlExternal) {
        this.showTooltip(this.tooltipHtmlExternal, newEvent);
      }
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