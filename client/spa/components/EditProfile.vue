<template>
  <div>
    <h1 class="h1">Настройки профиля</h1>
    <div class="link-list link-list_border">
      <router-link class="link" to="/changepassword">Изменить пароль</router-link>
      <router-link class="link" to="/deleteaccount">Удалить аккаунт</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'edit-profile'
  }

</script>
