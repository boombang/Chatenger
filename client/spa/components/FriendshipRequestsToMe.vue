<template>
  <div>
    <h1 class="h1">Заявки в друзья ко мне</h1>
    <div class="link-list link-list_border">
      <router-link class="link" to="/friends">Друзья</router-link>
      <router-link class="link" to="/fr-req-from-me">Заявки в друзья от меня</router-link>
      <router-link class="link" to="/blackList">Черный список</router-link>
    </div>
    <div class="link-list">
      <template v-for="user in users">
        <div class="link-button-line">
          <router-link class="link link-button-line__item" :to="'/profile/' + user.id" :key="user.id">{{user.login}}</router-link>
          <button class="simple-button link-button-line__item" @click="confirmFriendshipRequest(user.id, user.login)">Подтвердить дружбу</button>
          <button class="simple-button link-button-line__item" @click="cancelFriendshipRequestToMe(user.id)">Опровергнуть дружбу</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import axios from "axios";

  export default {
    name: 'friends',
    data() {
      return {
        users: []
      }
    },
    created() {
      this.$emit('loadStart');
      axios
      .get("/friends/showFriendshipRequestsToMe")
      .then(response => {
        this.users = response.data.users;
        this.$emit('loadEnd');
      })
      .catch(error => {
        this.$emit('loadEnd');
        this.$router.go(-1);
      });
    },
    methods: {
      cancelFriendshipRequestToMe(id) {
        this.$emit('loadStart');
        axios
      .post('/friends/cancelFriendshipRequestToMe', {
        id
      })
      .then(() => {
        this.$router.push('/');
          this.$emit('loadEnd');
      })
      .catch(error => {
        this.$emit('loadEnd');
          this.$router.go(-1);
      });
      },
      confirmFriendshipRequest(id, login) {
        this.$emit('loadStart');
        this.$emit('chatLoad');
        axios
        .post("/friends/confirmFriendshipRequest", {
          id,
          login
        })
      .then(response => {
        this.$router.push('/');
          this.$emit('loadEnd');
      })
      .catch(error => {
        this.$emit('loadEnd');
          this.$router.go(-1);
      });
      }
    }
  }

</script>
