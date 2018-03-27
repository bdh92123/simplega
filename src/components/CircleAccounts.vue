<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
  >
    <div class="row">
      <q-select
        v-model="year"
        :options="yearOptions"
        float-label="년도"
        class="col-6"
      />
      <q-select
        v-model="month"
        :options="monthOptions"
        float-label="월"
        class="col-6"
      />
    </div>
    <div class="row justify-between q-if">
      <q-btn icon="add" color="primary" @click="addAccountDialog">
        추가
      </q-btn>
      <q-btn icon="file download" color="secondary" @click="downloadReport">
        출납현황
      </q-btn>
    </div>
    <q-list>
      <q-item v-if="accounts.length == 0">
        <q-item-main>수입 지출이 없습니다.</q-item-main>
      </q-item>
      <q-item v-for="account in accounts" v-bind:key="account.id" link @click="showAccountAction(account)">
        <q-item-side icon="add" v-if="account.inout == 0" color="red"/>
        <q-item-side icon="remove" v-if="account.inout == 1" color="blue"/>
        <q-item-main>
          <q-item-tile label>{{ account.title }}</q-item-tile>
          <q-item-tile sublabel>{{ account.desc }}</q-item-tile>
        </q-item-main>
        <q-item-side right>
          <q-item-tile>{{ getAccountType(account.account_type_id).name }} - {{ new Date(account.date).toLocaleDateString() }}</q-item-tile>
          <q-item-tile color="black">{{ account.price.format() }}원</q-item-tile>
        </q-item-side>
      </q-item>
    </q-list>
    <q-list>
      <q-item>
        <q-item-main label="총 수입"/>
        <q-item-side right>
          <q-item-tile color="black">{{ totalIn.format() }}원</q-item-tile>
        </q-item-side>
      </q-item>
      <q-item>
        <q-item-main label="총 지출"/>
        <q-item-side right>
          <q-item-tile color="black">{{ totalOut.format() }}원</q-item-tile>
        </q-item-side>
      </q-item>
      <q-item>
        <q-item-main label="잔액"/>
        <q-item-side right>
          <q-item-tile color="black">{{ totalRemain.format() }}원</q-item-tile>
        </q-item-side>
      </q-item>
    </q-list>
    <form method="post" action="/reporting/api/report" ref="downloadForm" target="_blank">
      <input type="hidden" name="template[name]" value="CircleAccounts"/>
      <input type="hidden" name="data[year]" :value="year"/>
      <input type="hidden" name="data[month]" :value="month"/>
      <input type="hidden" name="options[Content-Disposition]" :value="'inline; filename=' + year + '_' + month + '_ACCOUNTS.pdf'"/>
      
    </form>
  </q-layout>
</template>

<script>
  import {
    QLayout, Toast, Dialog, ActionSheet
  } from 'quasar'
  import { getAccountType } from 'assets/accountTypes'
  import accountTypes from 'assets/accountTypes'

  export default {
    name: 'index',
    components: {
      QLayout
    },
    data () {
      return {
        monthOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => { return {value: month, label: month.toString()} }),
        accounts: [],
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
      }
    },
    watch: {
      year () {
        this.loadAccounts()
      },
      month () {
        this.loadAccounts()
      }
    },
    created() {
      this.loadAccounts()
    },
    computed: {
      circleId () {
        return this.$route.params.circleId
      },
      yearOptions () {
        let years = []
        let currentYear = new Date().getFullYear()
        for (var i = 0; i < 10; i++) {
          let year = (currentYear - i)
          years.push({label: year.toString(), value: year})
        }
        return years
      },
      totalIn () {
        return this.accounts.filter((account) => account.inout === 0).reduce((prev, cur) => prev + cur.price, 0)
      },
      totalOut () {
        return this.accounts.filter((account) => account.inout === 1).reduce((prev, cur) => prev + cur.price, 0)
      },
      totalRemain () {
        return this.totalIn - this.totalOut
      }
    },
    methods: {
      downloadReport () {
        this.$refs.downloadForm.submit()
      },
      getAccountType (id) {
        return getAccountType(id)
      },
      showAccountDialog (account, handler) {
		Dialog.create({
          noBackdropDismiss: true,
          title: '출납 입력',
          message: '수입/지출 정보를 입력해주세요.',
          form: {
            inout: {
              type: 'radio',
              model: account.inout,
              inline: true,
              items: [
                {
                  label: '수입',
                  value: 0
                },
                {
                  label: '지출',
                  value: 1
                }
              ]
            },
            account_type_id: {
              type: 'radio',
              model: account.account_type_id,
              inline: true,
              items: accountTypes.map((accountType) => { return { label: accountType.name, value: accountType.id } })
            },
            title: {
              type: 'text',
              label: '제목',
              model: account.title
            },
            desc: {
              type: 'text',
              label: '부가설명',
              model: account.desc
            },
            price: {
              type: 'number',
              label: '금액',
              model: account.price
            },
            date: {
              type: 'number',
              label: '날짜',
              model: account.date
            }
          },
          buttons: [
            {
              label: '확인',
              preventClose: true,
              handler: (data, close) => {
                let maxDate = new Date(this.year, this.month, 0).getDate()
                if (!(data.date >= 1 && data.date <= maxDate)) {
                  Toast.create('날짜는 1부터 ' + maxDate + '사이어야합니다.')
                  return
                }
                if (!data.title) {
                  Toast.create('제목을 입력하세요')
                  return
                }
                if (!data.price) {
                  Toast.create('가격을 입력하세요')
                  return
                }
                handler(data)
                close()
              }
            },
            '취소'
          ]
        })
      },
      modifyAccountDialog (accountId) {
      	this.$http.get(`/api/circles/${this.circleId}/accounts/${accountId}`).then((result) => {
      		result.data.date = new Date(result.data.date).getDate()
            this.showAccountDialog(result.data, (data) => {
	      		data.date = new Date(this.year, this.month - 1, data.date)
	            this.$http.put(`/api/circles/${this.circleId}/accounts/${accountId}`, data)
	            .then((result) => {
	                Toast.create('수정되었습니다.')
	                this.loadAccounts()
              	});
      		})
        })

      	
      },
      addAccountDialog () {
        this.showAccountDialog({
        	inout: 0,
        	account_type_id: 1,
        	title: '',
        	desc: '',
        	price: 0,
        	date: 1
        }, (data) => {
      		data.date = new Date(this.year, this.month - 1, data.date)
            this.$http.post(`/api/circles/${this.circleId}/accounts`, data)
              .then((result) => {
                Toast.create('추가되었습니다.')
                this.loadAccounts()
              });
      	})
      },
      loadAccounts () {
        this.$http.get(`/api/circles/${this.circleId}/accounts`, {
          params: {
            year: this.year,
            month: this.month
          }
        })
          .then((result) => {
            this.accounts = result.data
          })
      },
      showAccountAction (account) {
        ActionSheet.create({
          title: '메뉴',
          actions: [
          	{
              label: '수정',
              icon: 'edit',
              handler: () => {
                this.modifyAccountDialog(account.id)
              }
            },
            {
              label: '삭제',
              icon: 'delete',
              handler: () => {
                this.$http.delete(`/api/circles/${this.circleId}/accounts/${account.id}`)
                  .then((result) => {
                    Toast.create('삭제되었습니다')
                    this.loadAccounts()
                  })
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
