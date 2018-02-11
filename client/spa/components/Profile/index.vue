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
import axios from "axios";

export default {
  name: "profile",
  data() {
    return {
      myProfile: false,
      userLogin: undefined,
      userId: undefined,
      userType: undefined,
      uBlacked: undefined //заблокирован текущий пользователь?
    };
  },
  watch: {
    $route(to, from) {
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
      if (this.$route.params.login != this.$store.state.userLogin) {
        this.$emit("loadStart");
        this.myProfile = false;
        axios
          .get(`/profile/getUserData/${this.$route.params.login}`)
          .then(({ data }) => {
            this.userLogin = data.login;
            this.userId = data.id;
            if ("uBlacked" in data) {
              this.uBlacked = data.uBlacked;
            } else {
              if ("userType" in data) {
                this.userType = data.userType;
              }
            }
            this.$emit("loadEnd");
          })
          .catch(error => {
            this.$emit("loadEnd");
            this.$router.go(-1);
          });
      } else {
        this.myProfile = true;
        this.userLogin = this.$store.state.userLogin;
      }
    },
    removeFromBlackList() {
      if (this.$route.params.login != this.$store.state.userLogin) {
        this.$emit("loadStart");
        axios
          .post("/friends/removeFromBlackList", {
            id: this.userId
          })
          .then(response => {
            this.uBlacked = undefined;
            this.userType = "other";
            this.$emit("loadEnd");
          })
          .catch(error => {
            this.$emit("loadEnd");
            this.$router.go(-1);
          });
      }
    },
    sendFriendshipRequest() {
      if (this.$route.params.login != this.$store.state.userLogin) {
        this.$emit("loadStart");

        axios
          .post("/friends/sendFriendshipRequest", {
            id: this.userId
          })
          .then(response => {
            this.userType = "frReqFromMe";
            this.$emit("loadEnd");
          })
          .catch(error => {
            this.$emit("loadEnd");
            this.$router.go(-1);
          });
      }
    },
    removeFriendship() {
      if (this.$route.params.login != this.$store.state.userLogin) {
        this.$emit("loadStart");
        axios
          .post("/friends/removeFriendship", {
            id: this.userId
          })
          .then(response => {
            this.userType = "other";
            this.$emit("loadEnd");
          })
          .catch(error => {
            this.$emit("loadEnd");
            this.$router.go(-1);
          });
      }
    },
    confirmFriendshipRequest() {
      if (this.$route.params.login != this.$store.state.userLogin) {
        this.$emit("loadStart");

        axios
          .post("/friends/confirmFriendshipRequest", {
            id: this.userId
          })
          .then(response => {
            this.userType = "friend";
            this.$emit("loadEnd");
          })
          .catch(error => {
            this.$emit("loadEnd");
            this.$router.go(-1);
          });
      }
    },
    cancelFriendshipRequestToMe() {
      if (this.$route.params.login != this.$store.state.userLogin) {
        this.$emit("loadStart");
        axios
          .post("/friends/cancelFriendshipRequestToMe", {
            id: this.userId
          })
          .then(response => {
            this.userType = "other";
            this.$emit("loadEnd");
          })
          .catch(error => {
            this.$emit("loadEnd");
            this.$router.go(-1);
          });
      }
    },
    cancelFriendshipRequestFromMe() {
      if (this.$route.params.login != this.$store.state.userLogin) {
        this.$emit("loadStart");
        axios
          .post("/friends/cancelFriendshipRequestFromMe", {
            id: this.userId
          })
          .then(response => {
            this.userType = "other";
            this.$emit("loadEnd");
          })
          .catch(error => {
            this.$emit("loadEnd");
            this.$router.go(-1);
          });
      }
    }
  }
};
</script>

<style>

</style>
