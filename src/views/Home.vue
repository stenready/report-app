<template>
  <div class="home">
    <div class="container">
      <h1>Все отчёты</h1>
      <div class="row">
        <table class="highlight responsive-table" v-if="reportsData.length > 0">
          <thead>
            <tr>
              <th>Имя отправителя</th>
              <th>Дата отчёта</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(report, idx) of reportsData" :key="idx">
              <router-link
                class="link-report"
                tag="td"
                :to="`/report?edit=${report.mId}`"
              >
                {{ report.userName }}
              </router-link>
              <td>{{ report.reportDate }}</td>
              <td>{{ report.status }}</td>
              <td>
                <a
                  v-if="report.status !== 'done'"
                  class="waves-effect waves-light btn"
                  @click="addSecsess(report)"
                  >принять</a
                >
                <a
                  @click="removeReport(report)"
                  class="waves-effect waves-light btn"
                  >удалить</a
                >
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <h3 style="color: #e53935">У Вас еще нет ни одного отчёта</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Home",
  methods: {
    removeReport(report) {
      this.$swal({
        title: "Вы уверены что хотите удалить репорт? ",
        text: report.reportName,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Да удалить",
        cancelButtonText: "Нет я передумал(а)",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$toast.open({
            message: "Отчёт успешно удалён",
            type: "success",
            position: "top-right",
            duration: 1200,
          });
          this.$store.dispatch("removeReport", report);
        } else {
        }
      });
    },
    addSecsess(report) {
      this.$swal({
        title: "Вы согласны принять отчёт?",
        text: report.reportName,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Принять",
        cancelButtonText: "Отмена",
      }).then((res) => {
        if (res.isConfirmed) {
          report.status = "done";
          this.$store.dispatch("changeStatusReport", report);
          this.$toast.open({
            message: "Отчёт успешно принят",
            type: "success",
            position: "top-right",
            duration: 1200,
          });
        }
      });
    },
  },
  computed: {
    ...mapState({
      reportsData: (state) => state.report.reportsData,
    }),
  },
};
</script>

<style lang="scss" scoped>
.link-report {
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: #e57373;
  }
}
.btn {
  margin: 0 5px;
}
</style>
