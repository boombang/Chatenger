<template>
  <div>
    <h1 class="h1">Настройки диалога</h1>
    <div class="link-list link-list_border">
      <router-link class="link" to="/addUserToPartyDialog">Добавить пользователя в диалог</router-link>
      <router-link class="link" v-if="isCreator" to="/deleteUserFromPartyDialog">Удалить пользователя из диалога</router-link>
    </div>
    <button class="simple-button" v-if="isCreator" @click="removePartyDialog">Удалить диалог</button>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'dialog-settings',
    data() {
      return {
        dialogId: null,
        isCreator: null
      }
    },
    created() {
      this.dialogId = this.$store.state.dialogId;
      this.isCreator = this.$store.state.isCreator;
    },
    methods: {
      removePartyDialog() {
        axios
          .post('/dialogues/removePartyDialog', {
            id: this.dialogId
          })
          .then(response => {
            this.$emit('chatLoad');
            this.$router.push('/');
            alert('Вы успешно удалили диалог!');
          })
          .catch(err => alert('Что-то пошло не так... Повторите еще разок!'));
      }
    }
  }

</script>
