<template>
  <div>
    <h1 class="h1">Занести пользователя в черный список</h1>
    <simple-form class="simple-form_left" :formProps="formProps" @submitOk="submitOk($event)" @submitBad="submitBad($event)"></simple-form>
  </div>
</template>

<script>
  import SimpleForm from './SimpleForm';

  export default {
    name: 'add-to-black-list',
    data() {
      return {
        formProps: {
          formSubmitName: "Занести",
          httpPath: "/friends/addToBlackList",
          validation: () => {
            return true;
          },
          inputProps: [{
            name: "login",
            type: "text",
            maxlength: 30,
            placeholder: 'Введите логин',
            required: true
          }],
          redirectPath: "/blackList",
        }
      }
    },
    methods: {
      submitOk(e) {
        this.$emit('chatLoad');
        this.$router.push("/blackList");
      },
      submitBad(e) {
        this.$emit('chatLoad');
      }
    },
    components: {
      SimpleForm
    }
  }

</script>
