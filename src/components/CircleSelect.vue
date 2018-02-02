<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
  >
    <q-list>
      <q-item v-for="circle in circles" v-bind:key="circle.id" :to="'/circles/' + circle.id + '/'">
        <q-item-main :label="circle.name"/>
      </q-item>
    </q-list>
  </q-layout>
</template>

<script>
import {
  QLayout
} from 'quasar'

export default {
  name: 'index',
  components: {
    QLayout
  },
  created() {
    this.$http.get('/api/circles')
      .then((result) => {
        console.log(result)
        this.circles = result.data
      })
  },
  data () {
    return {
      circles: []
    }
  },
  $watch: {

  },
  computed: {

  },
  methods: {

  }
}
</script>

<style lang="stylus">
</style>
