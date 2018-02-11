<template>
  <div class="home">
    <template>
      <preloader class="nav" :preloaderProps="preloadersProps.homeNav" v-show="!homeNavReady"/>
      <core-nav class="nav" :homeNavProps="homeNavProps" v-show="homeNavReady"/>
    </template>
    <template>
      <preloader :preloaderProps="preloadersProps.chat" v-show="!chatReady"/>
      <chat class="half" v-if="userInit" v-show="chatReady" @chatReady="chatReadyHandler()" :reinitChat="reinitChat"/>
    </template>
    <template>
      <preloader :preloaderProps="preloadersProps.router" v-show="!mainReady"/>
      <router-view class="half" @chatLoad="chatLoad()" @loadStart="loadStart()" @loadEnd="loadEnd()" v-if="userInit" v-show="mainReady"/>
    </template>
  </div>
</template>

<script>
  import axios from 'axios';

  import Chat from "./Chat";
  import CoreNav from "./CoreNav";
  import Preloader from "./Simple/Preloader";

  export default {
    name: 'core',
    data() {
      return {
        chatReady: false,
        mainReady: false,
        homeNavReady: false,
        userInit: false,
        reinitChat: false,
        homeNavProps: [{
          name: 'Profile',
          path: () => `/profile/${this.$store.state.userLogin}`,
          clickHandler: () => {}
        }, {
          name: 'Friends',
          path: () => '/friendship',
          clickHandler: () => {}
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
      axios.get('/profile/getUserData').then(response => {
        console.log(response.data);
        this.$store.commit("userInit", response.data);
        this.mainReady = true;
        this.homeNavReady = true;
        this.userInit = true;
      }).catch(error => {
        console.log(error);
      });
    },
    methods: {
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
    components: {
      Chat,
      CoreNav,
      Preloader
    }
  }

</script>

<style scoped>
  .home {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 5vh 95vh;
  }

  .nav {
    grid-column: 1 / -1;
    grid-row: 1;
  }

  .half {
    padding: 0 30px;
  }

</style>
