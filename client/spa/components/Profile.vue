<template>
  <div class="my-profile" v-if="myProfile">
    <h1 class="h1">Мой профиль: {{userLogin}}</h1>
    <router-link class="link" to="/editprofile">Настройки профиля</router-link>
  </div>
  <div class="other-profile" v-else>
    <h1 class="h1">Профиль: {{userLogin}}</h1>
    <template v-if="uBlacked != undefined">
      <p v-if="uBlacked">Данный пользователь вас добавил в черный список</p>
      <button class="simple-button" v-else @click="removeFromBlackList">Удалить из черного списка</button>
    </template>
    <template v-else>
      <template v-if="userType == 'other'">
        <button class="simple-button" @click="sendFriendshipRequest">Добавить в друзья</button>
      </template>
      <button class="simple-button" v-if="userType=='friend'" @click="removeFriendship">Удалить из друзей</button>
      <template v-if="userType=='frReqToMe'">
        <button class="simple-button" @click="confirmFriendshipRequest">Принять заявку в друзья</button>
        <button class="simple-button" @click="cancelFriendshipRequestToMe">Отклонить заявку</button>
      </template>
      <template v-if="userType=='frReqFromMe'">
        <button class="simple-button" @click="cancelFriendshipRequestFromMe">Отклонить заявку</button>
      </template>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'profile',
    data() {
      return {
        myProfile: false,
        userLogin: undefined,
        userType: undefined,
        uBlacked: undefined, //заблокирован текущий пользователь?
      }
    },
    watch: {
      '$route' (to, from) {
        if (to.path !== from.path) {
          this.profileInit();
        }
      }
    },
    created() {
      this.profileInit();
    },
    methods: {
      profileInit() {
        if (this.$route.params.id != this.$store.state.userId) {
          this.$emit('loadStart');
          this.myProfile = false;
          this.$http.get(`/api/profile/getUserData/${this.$route.params.id}`).then(response => {
            let responseBody = response.body;
            this.userLogin = responseBody.login;
            if ("uBlacked" in responseBody) {
              this.uBlacked = responseBody.uBlacked;
            } else {
              if ("userType" in responseBody) {
                this.userType = responseBody.userType;
              }
            }
            this.$emit('loadEnd');
          }, response => {
            this.$emit('loadEnd');
            this.$router.go(-1);
          })
        } else {
          this.myProfile = true;
          this.userLogin = this.$store.state.userLogin;
        }
      },
      removeFromBlackList() {
        if (this.$route.params.id != this.$store.state.userId) {
          this.$emit('loadStart');
          this.$http.post('/api/friends/removeFromBlackList', JSON.stringify({
            id: this.$route.params.id
          })).then(response => {
            this.uBlacked = undefined;
            this.userType = 'other';
            this.$emit('loadEnd');
          }, response => {
            this.$emit('loadEnd');
            this.$router.go(-1);
          })
        }
      },
      sendFriendshipRequest() {
        if (this.$route.params.id != this.$store.state.userId) {
          this.$emit('loadStart');
          this.$http.post('/api/friends/sendFriendshipRequest', JSON.stringify({
            id: this.$route.params.id
          })).then(response => {
            this.userType = 'frReqFromMe';
            this.$emit('loadEnd');
          }, response => {
            this.$emit('loadEnd');
            this.$router.go(-1);
          })
        }
      },
      removeFriendship() {
        if (this.$route.params.id != this.$store.state.userId) {
          this.$emit('loadStart');
          this.$http.post('/api/friends/removeFriendship', JSON.stringify({
            id: this.$route.params.id
          })).then(response => {
            this.userType = 'other';
            this.$emit('loadEnd');
          }, response => {
            this.$emit('loadEnd');
            this.$router.go(-1);
          })
        }
      },
      confirmFriendshipRequest() {
        if (this.$route.params.id != this.$store.state.userId) {
          this.$emit('loadStart');
          this.$http.post('/api/friends/confirmFriendshipRequest', JSON.stringify({
            id: this.$route.params.id
          })).then(response => {
            this.userType = 'friend';
            this.$emit('loadEnd');
          }, response => {
            this.$emit('loadEnd');
            this.$router.go(-1);
          })
        }
      },
      cancelFriendshipRequestToMe() {
        if (this.$route.params.id != this.$store.state.userId) {
          this.$emit('loadStart');
          this.$http.post('/api/friends/cancelFriendshipRequestToMe', JSON.stringify({
            id: this.$route.params.id
          })).then(response => {
            this.userType = 'other';
            this.$emit('loadEnd');
          }, response => {
            this.$emit('loadEnd');
            this.$router.go(-1);
          })
        }
      },
      cancelFriendshipRequestFromMe() {
        if (this.$route.params.id != this.$store.state.userId) {
          this.$emit('loadStart');
          this.$http.post('/api/friends/cancelFriendshipRequestFromMe', JSON.stringify({
            id: this.$route.params.id
          })).then(response => {
            this.userType = 'other';
            this.$emit('loadEnd');
          }, response => {
            this.$emit('loadEnd');
            this.$router.go(-1);
          })
        }
      }
    }
  }

</script>

<style>


</style>
