<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
  >
    <q-list>
      <q-item>
        <q-item-side icon="perm identity" color="gray"/>
        <q-item-main :label="name"></q-item-main>
      </q-item>
      <q-item>
        <q-item-side icon="grade" color="gray"/>
        <q-item-main :label="classes"></q-item-main>
      </q-item>
      <q-item>
        <q-item-side icon="settings phone" color="gray"/>
        <q-item-main :label="phone"></q-item-main>
      </q-item>
      <q-item>
        <q-item-side icon="date range" color="gray"/>
        <q-item-main :label="regist_date"></q-item-main>
      </q-item>
      <q-item-separator/>
      <q-item>
        <q-item-main label="회비입금여부">
          <q-select
            v-model="year"
            :options="yearOptions"
            float-label="년도"
          />
        </q-item-main>
      </q-item>
      <q-item v-for="month in 12" :key="month" link @click="addDueDialog(month)">
        <template v-if="monthDues[month]">
          <q-item-main :label="month + '월'" :sublabel="'입금일: ' + monthDues[month].pay_date.toLocaleDateString()"/>
          <q-item-side icon="done" v-if="monthDues[month]" color="green"/>
        </template>
        <template v-else>
          <q-item-main :label="month + '월'" sublabel="입금안함"/>
          <q-item-side icon="close" color="red"/>
        </template>

      </q-item>
    </q-list>
    <div class="row">
      <q-btn icon="close" color="red" @click="deleteMember">
        삭제
      </q-btn>
    </div>
    <q-modal ref="dueInputModal" :content-css="{padding: '30px'}" minimized>
      <h4>회비납부</h4>
      <div class="row sm-gutter">
        <div class="col-12">
          회비납부 정보를 입력하세요
        </div>
        <div class="col-12">
          <q-checkbox v-model="checked" label="납부" />
          <q-datetime v-model="due.pay_date" type="date" :month-names='months' :day-names='days' ok-label='확인' clear-label='초기화' cancel-label='취소'/>
        </div>
        <div class="row col-12 justify-end">
          <div>
            <q-btn color="primary" @click="addDueConfirm()">확인</q-btn>
            <q-btn color="primary" @click="$refs.dueInputModal.close()">취소</q-btn>
          </div>
        </div>
      </div>
    </q-modal>
  </q-layout>
</template>

<script>
  import { QLayout, Dialog, Toast } from 'quasar'
import { getClassesLabel } from 'assets/memberClasses'

export default {
  name: 'index',
  components: {
    QLayout
  },
  created () {
    this.loadMember()
  },
  data () {
    return {
      name: '',
      classes: '',
      phone: '',
      regist_date: '',
      dues: [],
      checked: false,
      due: { pay_date: new Date(), due_month: new Date() },
      year: new Date().getFullYear()
    }
  },
  watch: {
    year() {
      console.log("he")
      this.loadMember()
    }
  },
  computed: {
    months () {
      return ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
    },
    days () {
      return ['일', '월', '화', '수', '목', '금', '토']
    },
    circleId () {
      return this.$route.params.circleId
    },
    memberId () {
      return this.$route.params.memberId
    },
    monthDues () {
      let monthDueMap = {}
      this.dues.forEach((due) => {
        let month = new Date(due.due_month).getMonth() + 1
        monthDueMap[month] = {
          id: due.id,
          desc: due.desc,
          due_month: new Date(due.due_month),
          pay_date: new Date(due.pay_date)
        }
      })
      return monthDueMap
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
    loadMember () {
      this.$http.get(`/api/circles/${this.circleId}/members/${this.memberId}`)
        .then((result) => {
          this.name = result.data.name
          this.classes = getClassesLabel(result.data.classes)
          this.phone = result.data.phone
          this.regist_date = new Date(result.data.regist_date).toLocaleDateString()

        })
      this.$http.get(`/api/circles/${this.circleId}/members/${this.memberId}/dues`,
        {
          params: {
            year: this.year
          }
        })
        .then((result) => {
          this.dues = result.data
        })
    },
    addDueDialog (month) {
      let due = this.monthDues[month]
      this.checked = due ? true : false
      this.due = due ? due : { due_month: new Date(this.year, month - 1), pay_date: new Date(this.year, month - 1) }
      this.$refs.dueInputModal.open()
    },
    addDueConfirm () {
      let check = this.checked
      let id = this.due.id

      if(check) {
        console.log(this.due)
        this.$http.post(`/api/circles/${this.circleId}/members/${this.memberId}/dues`, {
          due_month: this.due.due_month,
          pay_date: this.due.pay_date
        })
          .then((result) => {
            Toast.create('수정완료')
            this.loadMember()
          })
      } else if(this.monthDues[this.due.due_month.getMonth() + 1]) {
        this.$http.delete(`/api/circles/${this.circleId}/members/${this.memberId}/dues/${id}`)
          .then((result) => {
            Toast.create('수정완료')
            this.loadMember()
          })
      }
      this.$refs.dueInputModal.close()
    },
    deleteMember () {
      Dialog.create({
        title: '탈퇴',
        message: '정말 탈퇴시키겠습니까?',
        buttons: [
          {
            label: '탈퇴처리',
            handler: () => {
              this.$http.post(`/api/circles/${this.circleId}/members/${this.memberId}/expire`)
                .then(() => {
                  Toast.create('탈퇴처리 되었습니다.')
                  this.$router.replace(`/circles/${this.circleId}/members`)
                })
            }
          },
          {
            label: '취소',
            handler () {

            }
          }
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
