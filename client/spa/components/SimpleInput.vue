<template>
  <input class="simple-input" @input="updateValue($event.target.value)">
</template>

<script>
  export default {
    name: 'simple-input',
    methods: {
      updateValue(value) {
        this.$emit('input', value);
      }
    }
  }

</script>

<style>
  .simple-input,
  .textarea {
    margin-bottom: 15px;
    width: 270px;
    padding: 6px 12px 8px;
    height: 35px;
    border-radius: 3px;
    color: #000;
    border: 1px solid #d3d9de;
    outline: none;
    &:focus {
      border-color: #c9d0d6;
    }
    &:focus::placeholder {
      color: #c9d0d6;
    }
    &::placeholder {
      color: #8b909a;
    }
  }

  .textarea {
    margin: 0;
    resize: none;
    width: 100%;
    height: 70px;
  }

</style>
