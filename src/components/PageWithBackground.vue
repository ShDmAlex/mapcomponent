<template>
  <div class="page-container">
    <header class="page-header">
      <div class="header-content">
        <h1>Северо-Казахстанская область</h1>
        <v-popover
          ref="popover"
          :placement="'bottom-end'"
          :offset="5"
          :trigger="'click'"
          :autoHide="true"
          :container="false"
          :popoverClass="'lang-tooltip'"
        >
          <!-- Popover target -->
          <button class="lang-toggle">
            {{ selectedLanguage === 'Русский' ? 'РУС' : 'ҚАЗ' }}
          </button>
          <!-- Popover content -->
          <template slot="popover">
            <div class="lang-menu tooltip-body">
              <div
                class="lang-option"
                @click="selectLanguage('Қазақ')"
              >
                <i
                  v-if="selectedLanguage === 'Қазақ'"
                  class="fa-solid fa-check checkmark"
                ></i>
                <span
                  v-else
                  class="checkmark-placeholder"
                ></span>
                Қазақ
              </div>
              <div
                class="lang-option"
                @click="selectLanguage('Русский')"
              >
                <i
                  v-if="selectedLanguage === 'Русский'"
                  class="fa-solid fa-check checkmark"
                ></i>
                <span
                  v-else
                  class="checkmark-placeholder"
                ></span>
                Русский
              </div>
              <div class="lang-title">Выбор языка интерфейса</div>
            </div>
          </template>
        </v-popover>
      </div>
    </header>
    <div class="main-wrapper">
      <aside class="navigation-menu">
        <div class="navigation-modules">
          <div
            class="module-icon"
            :class="{ active: activeModule === 1 }"
            @click="selectModule(1)"
          >
            <i class="fas fa-cogs"></i>
          </div>
          <div
            class="module-icon"
            :class="{ active: activeModule === 2 }"
            @click="selectModule(2)"
          >
            <i class="fas fa-chart-line"></i>
          </div>
          <div
            class="module-icon"
            :class="{ active: activeModule === 3 }"
            @click="selectModule(3)"
          >
            <i class="fas fa-user"></i>
          </div>
        </div>
        <div class="navigation-links">
          <div
            v-for="link in moduleLinks[activeModule]"
            :key="link.href"
          >
            <a
              :href="link.href"
              class="link"
              :class="{ active: activeLink === link.href }"
              @click="setActiveLink(link.href)"
            >
              <i :class="link.icon"></i>
              <span>{{ link.label }}</span>
            </a>
          </div>
        </div>
      </aside>
      <main class="page-content">
        <MapCard />
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script>
import MapCard from './MapCard.vue';
import { VPopover } from 'v-tooltip'; 

export default {
  name: 'PageWithBackground',
  components: {
    MapCard,
    'v-popover': VPopover 
  },
  props: {
    backgroundColor: {
      type: String,
      default: '#4d4a4a'
    }
  },
  data() {
    return {
      activeModule: 1,
      activeLink: null,
      selectedLanguage: 'Русский',
      moduleLinks: {
        1: [
          { href: "http://general:81/dist/", icon: "fa-solid fa-chart-line", label: "Общие сведения" },
          { href: "http://lastvue:81/dist/", icon: "fa-solid fa-users-line", label: "Переселенцы" },
          { href: "http://kandas:81/dist/", icon: "fa-solid fa-user-shield", label: "Кандасы" },
          { href: "http://demography:81/dist/", icon: "fa-solid fa-users", label: "Демография" },
          { href: "http://health:81/dist/", icon: "fa-solid fa-stethoscope", label: "Здравоохранение" },
          { href: "http://trade:81/dist/", icon: "fa-solid fa-cash-register", label: "Торговля" },
          { href: "http://animal:81/dist/", icon: "fa-solid fa-cow", label: "Животноводство" },
          { href: "http://plant:81/dist/", icon: "fa-solid fa-plant-wilt", label: "Растениеводство" }
        ],
        2: [],
        3: []
      },
      hashMapping: {
        "/general/dist/index.html": "#general",
        "/health/dist/index.html": "#health",
        "/kandas/dist/index.html": "#kandas",
        "/lastvue/dist/index.html": "#lastvue",
        "/demography/dist/index.html": "#demography",
        "/trade/dist/index.html": "#trade",
        "/animal/dist/index.html": "#animal",
        "/plant/dist/index.html": "#plant"
      }
    };
  },
  computed: {
    pageStyles() {
      return {
        backgroundColor: this.backgroundColor
      };
    }
  },
  methods: {
    selectModule(moduleId) {
      this.activeModule = moduleId;
    },
    setActiveLink(linkHref) {
      this.activeLink = linkHref;
    },
    initializeActiveLink() {
      const currentUrl = window.location.href;
      const allLinks = Object.values(this.moduleLinks).flat();
      const matchingLink = allLinks.find(link => currentUrl.startsWith(link.href));
      if (matchingLink) {
        this.activeLink = matchingLink.href;
        this.activeModule = this.getModuleByLink(matchingLink.href);
      } else if (allLinks.length) {
        const firstLink = allLinks[0];
        this.activeLink = firstLink.href;
        this.activeModule = this.getModuleByLink(firstLink.href);
      }
    },
    getModuleByLink(linkHref) {
      for (const [module, links] of Object.entries(this.moduleLinks)) {
        if (links.some(link => link.href === linkHref)) {
          return parseInt(module);
        }
      }
      return 1;
    },
    selectLanguage(lang) {
      this.selectedLanguage = lang;
      this.$refs.popover.hide(); 
    }
  },
  mounted() {
    this.initializeActiveLink();
    window.selectLanguage = this.selectLanguage.bind(this);
  },
  beforeDestroy() {
    window.selectLanguage = null;
  }
};
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.main-wrapper {
  display: flex;
  flex-grow: 1;
  background-color: #1f2324;
  justify-content: space-between;
}

.navigation-menu {
  width: 220px;
  display: flex;
  flex-direction: row;
  background-color: #1f2324;
  color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  margin-right: 10px;
}

.navigation-modules {
  width: 40px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: #23272a;
  padding: 0;
}

.module-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  font-size: 18px;
  color: #b9bbbe;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.module-icon.active {
  background-color: #4d4a4a;
  color: white;
  border-radius: 5px;
}

.module-icon:hover {
  color: white;
}

.navigation-links {
  flex-grow: 1;
  width: 180px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}

.link {
  display: flex;
  align-items: stretch;
  color: #b9bbbe;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s, background-color 0.2s;
  width: 100%;
  padding: 5px 5px;
}

.link.active {
  background-color: #4d4a4a;
  color: white;
  border-radius: 5px;
}

.link i {
  margin-right: 5px;
  font-size: 15px;
}

.link:hover {
  color: white;
}

.page-header {
  background-color: #1f2324;
  padding: 10px;
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-header h1 {
  margin: 0;
  font-size: 18px;
}

.page-content {
  flex-grow: 1;
  padding: 0px;
}

</style>
