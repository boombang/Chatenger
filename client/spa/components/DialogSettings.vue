<template>
  <div>
    <h1 class="h1">Настройки диалога</h1>
    <div class="link-list link-list_border">
      <router-link class="link" to="/addUserToPartyDialog">Добавить пользователя в диалог</router-link>
      <router-link class="link" v-if="isCreator" to="/deleteUserFromPartyDialog">Удалить пользователя из диалога</router-link>
    </div>
    <button class="simple-button" v-if="isCreator" @click="deletePartyDialog()">Удалить диалог</button>
  </div>
</template>

<script>
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
      deletePartyDialog() {
        this.$http.post('/api/dialogues/deletePartyDialog', JSON.stringify({
          id: this.dialogId
        })).then(response => {
          this.$emit('chatLoad');
          this.$router.push('/');
          alert('Вы успешно удалили диалог!');
        }, response => {
          alert('Что-то пошло не так... Повторите еще разок!');
        })
      }
    }
  }

</script>
