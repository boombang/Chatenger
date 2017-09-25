<template>
  <select v-model="selected" class="select">
    <option selected disabled>{{defaultOption}}</option>    
    <option v-for="(dialogId, dialogNum) in dialoguesId" :value="dialogNum" :key="dialogId">{{dialoguesNames[dialogNum]}}</option>
  </select>
</template>

<script>
  export default {
    name: 'sort-select',
    props: {
      dialoguesId: {
        type: Array
      },
      dialoguesNames: {
        type: Array
      },
      defaultOption: {
        type: String
      },
      dialoguesType: {
        type: String
      },
      isCreator: {
        type: Array
      }
    },
    data() {
      return {
        selected: null
      }
    },
    watch: {
      selected: {
        handler: function (index) {
          this.$emit('dialogSelect', this.dialoguesType, this.dialoguesId[index]);
          this.$store.commit("dialogSelect", {
            dialogId: this.dialoguesId[index],
            isCreator: this.isCreator[index]
          });
        }
      }
    }
  }

</script>


<style scoped>
  .select {
    padding: 5px 20px 5px 5px;
    background: #f2f3f5;
    color: #444;
    border: 1px solid #aaa;
    border-radius: 0;
    display: inline-block;
    cursor: pointer;
    outline: none;
    border-radius: 3px;
  }

</style>
