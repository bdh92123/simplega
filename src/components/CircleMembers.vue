<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
  >
    <q-select
      v-model="year"
      :options="yearOptions"
      float-label="년도"
    />
    <div class="row justify-between">
      <div>
        <q-btn icon="add" color="primary" @click="addMemberDialog">
          추가
        </q-btn>
      </div>
      <div>
        <q-btn icon="file download" color="secondary" @click="downloadReport('CircleMembers')">
          회원명단
        </q-btn>
        <q-btn icon="file download" color="secondary" @click="downloadReport('CircleMemberDues')">
          회비현황
        </q-btn>
      </div>
    </div>
    <q-search
      v-model="searchText"
      :debounce="100"
      placeholder="회원 검색"
    />
    <q-list>
      <q-item v-for="member in searchedMembers" v-bind:key="member.id" :to="member.id.toString()" append>
        <q-item-main :label="member.name" :sublabel="'가입일: ' + new Date(member.regist_date).toLocaleDateString()"/>
      </q-item>
    </q-list>
    <form method="post" action="/reporting/api/report" ref="downloadForm" target="_blank">
      <input type="hidden" name="template[name]" value="CircleMembers"/>
      <input type="hidden" name="data[year]" :value="year"/>
    </form>
  </q-layout>
</template>

<script>
import {
  QLayout, Toast, Dialog
} from 'quasar'
import classes from 'assets/memberClasses'

export default {
  name: 'index',
  components: {
    QLayout
  },
  data () {
    return {
      year: new Date().getFullYear(),
      searchText: '',
      members: []
    }
  },
  created() {
    this.loadMembers()
  },
  $watch: {

  },
  computed: {
    circleId() {
      return this.$route.params.circleId
    },
    searchedMembers: function () {
      return this.members.filter((member) => {
        return member.name.indexOf(this.searchText) > -1
      })
    },
    yearOptions () {
      let years = []
      let currentYear = new Date().getFullYear()
      for (var i = 0; i < 10; i++) {
        let year = (currentYear - i)
        years.push({label: year.toString(), value: year})
      }
      return years
    }
  },
  methods: {
    downloadReport (template) {
      global.a=this.$refs
      this.$refs.downloadForm['template[name]'].value = template
      this.$refs.downloadForm.submit()
    },
    loadMembers() {
      this.$http.get(`/api/circles/${this.circleId}/members`)
        .then((result) => {
          this.members = result.data
        })
    },
    addMemberDialog () {
      Dialog.create({
        title: '회원 추가',
        message: '추가할 회원의 정보를 입력해주세요.',
        form: {
          name: {
            type: 'text',
            label: '이름',
            model: ''
          },
          phone: {
            type: 'text',
            label: '핸드폰번호',
            model: ''
          },
          header1: {
            type: 'heading',
            label: '등급'
          },
          classes: {
            type: 'radio',
            model: Object.keys(classes)[0],
            inline: true,
            items: Object.entries(classes).map((entry) => { return { label: entry[1], value: entry[0] } })
          }
        },
        buttons: [
          {
            label: '추가',
            handler: (data) => {
              this.$http.post(`/api/circles/${this.circleId}/members`, data)
                .then((result) => {
                  this.loadMembers()
                  Toast.create('Returned ' + JSON.stringify(result))
                })
            }
          },
          '취소'
        ]
      })
    }
  },
  mounted () {

  }
}
</script>

<style lang="stylus">
</style>
