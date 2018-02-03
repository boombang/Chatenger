<template>
  <div>
    <h1 class="h1">Изменение пароля</h1>
    <router-link class="link" to="/editprofile">Обратно к настройкам профиля</router-link>
    <simple-form class="simple-form_left" :formProps="formProps" @submitOk="submitOk($event)">
    </simple-form>
  </div>
</template>

<script>
  import SimpleForm from "./SimpleForm.vue";

  export default {
    name: "change-password",
    data() {
      return {
        formProps: {
          formSubmitName: "Изменить пароль",
          httpPath: "/profile/changePassword",
          validation: () => {
            let
              oldPasswordInput = document.querySelector('input[name="oldPassword"]'),
              newPasswordInput = document.querySelector('input[name="newPassword"]'),
              confirmNewPasswordInput = document.querySelector('input[name="confirmNewPassword"]');
            if (oldPasswordInput.value === newPasswordInput.value) {
              alert("Предложенные вами старый и новый пароли совпадают!");
              return false;
            }
            if (newPasswordInput.value !== confirmNewPasswordInput.value) {
              alert("Новые пароли не совпадают!");
              return false;
            }
            return true;
          },
          inputProps: [{
            name: "oldPassword",
            type: "password",
            maxlength: 40,
            placeholder: 'Введите ваш старый пароль',
            required: true
          }, {
            name: "newPassword",
            type: "password",
            maxlength: 40,
            placeholder: 'Введите ваш новый пароль',
            required: true
          }, {
            name: "confirmNewPassword",
            type: "password",
            maxlength: 40,
            placeholder: 'Подтвердите ваш новый пароль',
            required: true
          }]
        },
        redirectPath: "/editprofile"
      }
    },
    methods: {
      submitOk($event) {
        alert('Ваш пароль успешно изменен!');
        this.$router.push(this.redirectPath);
      }
    },
    components: {
      SimpleForm
    }
  }

</script>
