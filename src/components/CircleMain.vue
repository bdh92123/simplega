<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
  >
    <q-toolbar slot="header" class="glossy">
      <q-btn
        flat
        @click="$refs.layout.toggleLeft()"
      >
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title>
        간단 장부관리
        <div slot="subtitle">Made by bdh92123</div>
      </q-toolbar-title>
    </q-toolbar>

    <div slot="left">
      <!--
        Use <q-side-link> component
        instead of <q-item> for
        internal vue-router navigation
      -->

      <q-list-header>메뉴</q-list-header>
      <q-side-link item :to="'/circles/' + circleId + '/members'">
          <q-item-side icon="face" />
          <q-item-main label="회원목록" sublabel="" />
      </q-side-link>
      <q-side-link item :to="'/circles/' + circleId + '/accounts'">
        <q-item-side icon="attach money" />
        <q-item-main label="출납관리" sublabel="" />
      </q-side-link>
    </div>

    <!--
      Replace following <div> with
      <router-view /> component
      if using subRoutes
    -->
    <keep-alive>
      <div class="layout-padding">
        <router-view/>
      </div>
    </keep-alive>
  </q-layout>
</template>

<script>

export default {
  name: 'index',
  data () {
    return {

    }
  },
  computed: {
    circleId () {
      return this.$route.params.circleId
    }
  },
  methods: {
  },
  mounted () {
  },
  beforeDestroy () {

  }
}
</script>

<style lang="stylus">
</style>
