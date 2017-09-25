<template>
  <div class="home">
    <template>
      <preloader class="home__nav" :preloaderProps="preloadersProps.homeNav" v-show="!homeNavReady"></preloader>
      <main-nav class="home__nav" :homeNavProps="homeNavProps" v-show="homeNavReady"></main-nav>
    </template>
    <template>
      <preloader :preloaderProps="preloadersProps.chat" v-show="!chatReady"></preloader>
      <chat class="home__half" v-if="userInit" v-show="chatReady" @chatReady="chatReadyHandler()" :reinitChat="reinitChat"></chat>
    </template>
    <template>
      <preloader :preloaderProps="preloadersProps.router" v-show="!mainReady"></preloader>
      <router-view class="home__half" @chatLoad="chatLoad()" @loadStart="loadStart()" @loadEnd="loadEnd()" v-if="userInit" v-show="mainReady"></router-view>
    </template>
  </div>
</template>

<script>
  import Chat from "./Chat.vue";
  import MainNav from "./MainNav.vue";
  import Preloader from "./Preloader";

  export default {
    name: 'main',
    data() {
      return {
        chatReady: false,
        mainReady: false,
        homeNavReady: false,
        userInit: false,
        reinitChat: false,
        homeNavProps: [{
          name: 'Профиль',
          path: () => `/profile/${this.getUserId}`,
          clickHandler: () => {}
        }, {
          name: 'Друзья',
          path: () => '/friends',
          clickHandler: () => {}
        }, {
          name: 'Выйти',
          path: () => '/auth',
          clickHandler: () => {
            this.deleteCookie("Chatenger.Cookies");
          }
        }],
        preloadersProps: {
          homeNav: {
            themeBackgroundColor: '#17141f',
            preloaderColor: '#fff'
          },
          chat: {
            themeBackgroundColor: '#efeef1',
            preloaderColor: '#17141f'
          },
          router: {
            themeBackgroundColor: '#fff',
            preloaderColor: '#17141f'
          }
        }
      }
    },
    created() {
      this.$http.get('/api/profile/getUserData').then(response => {
        this.$store.commit("userInit", response.body);
        this.mainReady = true;
        this.homeNavReady = true;
        this.userInit = true;
      }, response => {
        this.deleteCookie(".AspNetCore.Cookies");
        this.$router.push('/auth');
      })
    },
    methods: {
      getCookie(name) {
        var matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : false;
      },

      deleteCookie(name, path, domain) {
        if (this.getCookie(name)) {
          document.cookie = name + "=" +
            ((path) ? ";path=" + path : "") +
            ((domain) ? ";domain=" + domain : "") +
            ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
        }
        this.$store.commit("authFlag", false);
      },

      loadStart() {
        this.mainReady = false;
      },

      loadEnd() {
        this.mainReady = true;
      },

      chatLoad() {
        this.chatReady = false;
        this.reinitChat = true;
      },

      chatReadyHandler() {
        this.chatReady = true;
        this.reinitChat = false;
      }
    },
    computed: {
      getUserId() {
        return this.$store.state.userId
      }
    },
    components: {
      Chat,
      MainNav,
      Preloader
    }
  }

</script>

<style>
  .home {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 5vh 95vh;
    &__nav {
      grid-column: 1 / -1;
      grid-row: 1;
    }
    &__half {
      padding: 0 30px;
    }
  }

</style>
