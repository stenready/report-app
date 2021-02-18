<template>
  <div class="create-report">
    <div class="container">
      <div class="row d-flex js-c">
        <div class="col s8 n-margin">
          <h1 class="header">
            {{ $route.query.edit ? "Редактировать отчёт" : "Добавить отчёт" }}
          </h1>
          <span class="desc">
            <template>
              <div v-if="!$route.query.edit">
                Тут Вы можете добавить Ваш отчёт. Напишите то, чем Вы занимались
                за определённую дату
              </div>
              <div v-else>
                Тут Вы можете изменить Ваш отчёт. Обратите внимание, что если
                отчёт уже принят и Вы его меняете то его статус снвоа будет
                <strong>"pending"</strong>
              </div>
            </template>
          </span>
          <div class="card horizontal s6 m5">
            <div class="card-stacked">
              <div class="card-content">
                <div class="input-field col s12">
                  <input
                    :class="{
                      invalid: $v.name.$error && $v.name.$dirty,
                      valid: !$v.name.$error && $v.name.$dirty,
                    }"
                    class="form-input"
                    @focus="nameFiledIsFocus = true"
                    @blur="
                      name.length === 0
                        ? (nameFiledIsFocus = false)
                        : (nameFiledIsFocus = true)
                    "
                    id="name"
                    type="text"
                    v-model.trim="$v.name.$model"
                  />
                  <label
                    class="form-label"
                    for="name"
                    :class="{ active: nameFiledIsFocus }"
                    >Введите имя</label
                  >
                  <span
                    v-if="!$v.name.required && $v.name.$dirty"
                    class="helper-text"
                    >Имя - обязательное поле</span
                  >
                  <span class="helper-text" v-if="!$v.name.minLength"
                    >Длинна имени не может быть меньше 4 символов</span
                  >
                </div>

                <div class="input-field col s12">
                  <input
                    :class="{
                      invalid: $v.reportName.$error && $v.reportName.$dirty,
                      valid: !$v.reportName.$error && $v.reportName.$dirty,
                    }"
                    class="form-input"
                    @focus="reportNameFildFocus = true"
                    @blur="
                      reportName.length === 0
                        ? (reportNameFildFocus = false)
                        : (reportNameFildFocus = true)
                    "
                    id="report-name"
                    type="text"
                    v-model.trim="$v.reportName.$model"
                  />
                  <label
                    class="form-label"
                    for="report-name"
                    :class="{ active: reportNameFildFocus }"
                    >Название отчёта</label
                  >
                  <span
                    v-if="!$v.reportName.required && $v.reportName.$dirty"
                    class="helper-text"
                    >Вы не можете без названия. Укажите его! :)</span
                  >
                  <span class="helper-text" v-if="!$v.reportName.minLength"
                    >Длинна отчёта не может быть меньше чем 10 символов</span
                  >
                </div>

                <div class="date-wrap">
                  <label
                    style="font-size: 1rem; margin-left: 10px"
                    class="form-label"
                    for="email"
                    >Дата за которую сдаёте отчёт</label
                  >
                  <date-picker
                    :input-class="
                      $v.time.$error && $v.time.$dirty ? 'invalid' : 'valid'
                    "
                    range-separator=" "
                    :disabled-date="disabledDates"
                    v-model="$v.time.$model"
                    valueType="timestamp"
                  ></date-picker>
                  <span
                    class="helper-text"
                    style="margin-left: 10px; font-size: 12px"
                    v-if="!$v.time.required && $v.time.$dirty"
                    >Обязательное поле!</span
                  >
                </div>

                <div class="input-field col s12">
                  <textarea
                    :class="{
                      invalid: $v.description.$error && $v.description.$dirty,
                      valid: !$v.description.$error && $v.description.$dirty,
                    }"
                    style="height: 100px; overflow-y: scroll"
                    @focus="descriptionFiledFocus = true"
                    @blur="
                      description.length === 0
                        ? (descriptionFiledFocus = false)
                        : (descriptionFiledFocus = true)
                    "
                    id="description"
                    class="materialize-textarea"
                    v-model.trim="$v.description.$model"
                  ></textarea>
                  <label
                    :class="{ active: descriptionFiledFocus }"
                    for="description"
                    >Расскажите о том что интересного Вы сделали!</label
                  >
                  <span
                    v-if="!$v.description.required && $v.description.$dirty"
                    class="helper-text"
                    >Отчёт без описания? WTF??</span
                  >
                </div>
              </div>
              <div class="card-action">
                <a
                  v-if="!$route.query.edit"
                  href="#"
                  class="waves-effect waves-light btn btn-custom"
                  @click.prevent="sendFormHandler"
                  >Создать</a
                >
                <template v-else>
                  <a
                    href="#"
                    @click.prevent="editHandler"
                    class="waves-effect waves-light btn btn-custom"
                    >Редактировать</a
                  >
                  <a
                    href="#"
                    @click.prevent="canselEditHandler"
                    class="waves-effect waves-light btn btn-custom"
                    >Отменить редактирование</a
                  >
                  <a
                    v-if="findOne && findOne.status !== 'done'"
                    href="#"
                    @click.prevent="agreeReport"
                    class="waves-effect waves-light btn btn-custom"
                    >Принять отчёт</a
                  >
                  <a
                    href="#"
                    @click.prevent="deleteReport"
                    class="waves-effect waves-light btn btn-custom"
                    >Удалить отчёт</a
                  >
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";
import DatePicker from "vue2-datepicker";
import transformTimeFiunc from "@/utils/transformTimeFiunc.js";
import { mapState } from "vuex";
export default {
  components: { DatePicker },
  data() {
    return {
      time: Date.now(),
      nameFiledIsFocus: false,
      reportNameFildFocus: false,
      descriptionFiledFocus: false,
      name: "",
      reportName: "",
      description: "",
    };
  },
  validations: {
    time: {
      required,
    },
    description: {
      required,
    },
    name: {
      required,
      minLength: minLength(4),
    },
    reportName: {
      required,
      minLength: minLength(10),
    },
  },
  methods: {
    deleteReport() {
      this.$swal({
        title: "Вы уверены что хотите удалить отчёт?",
        text: this.findOne.reportName,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Принять",
        cancelButtonText: "Отмена",
      }).then((res) => {
        if (res.isConfirmed) {
          this.$toast.open({
            message: "Отчёт успешно удалён",
            type: "success",
            position: "top-right",
            duration: 1200,
          });
          this.$store.dispatch("removeReport", this.findOne);
          setTimeout(() => {
            this.$router.push("/");
          }, 1200);
        }
      });
    },
    agreeReport() {
      this.$swal({
        title: "Вы уверены что хотите принять отчёт?",
        text: this.findOne.reportName,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Принять",
        cancelButtonText: "Отмена",
      }).then((res) => {
        if (res.isConfirmed) {
          this.$store.dispatch("changeStatusReport", this.findOne);
          this.$toast.open({
            message: "Отчёт успешно принят",
            type: "success",
            position: "top-right",
            duration: 1200,
          });
          setTimeout(() => {
            this.$router.push("/");
          }, 1200);
        }
      });
    },
    canselEditHandler() {
      this.$swal({
        title: "Вы уверены что хотите отменить редактирование?",
        text: this.findOne.reportName,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Да",
        cancelButtonText: "Нет",
      }).then((res) => {
        if (res.isConfirmed) {
          this.$router.push("/");
        }
      });
    },
    sendFormHandler() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$toast.open({
          message: "Проверьте введённые данные!",
          type: "error",
          position: "top-right",
          duration: 1200,
        });
      } else {
        const resultOjb = {
          mId: Date.now(),
          userName: this.name,
          reportName: this.reportName,
          reportDate: transformTimeFiunc(this.time),
          time: this.time,
          report: this.description,
          status: "pending",
        };
        console.log(resultOjb, "hhhh");
        this.$store.dispatch("setReportData", resultOjb);
        this.$v.$reset();
        this.name = this.reportName = this.description = "";
        this.time = Date.now();
        this.$toast.open({
          message: "Ваш отчёт успешно отправлен!",
          type: "success",
          position: "top-right",
          duration: 1200,
        });
        setTimeout(() => {
          this.$router.push("/");
        }, 1200);
      }
    },
    editHandler() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$toast.open({
          message: "Проверьте введённые данные!",
          type: "error",
          position: "top-right",
          duration: 1500,
        });
      } else {
        const newEditObject = {
          mId: this.findOne.mId,
          userName: this.name,
          reportName: this.reportName,
          reportDate: transformTimeFiunc(this.time),
          time: this.time,
          report: this.description,
          status: "pending",
        };

        // console.log("stas", newEditObject);
        this.$store.dispatch("editReport", newEditObject);
        this.$toast.open({
          message: "Ваш отчёт успешно изменён!",
          type: "success",
          position: "top-right",
          duration: 1500,
        });

        setTimeout(() => {
          this.$router.push("/");
        }, 1200);
      }
    },
    disabledDates(date) {
      if (date > Date.now()) return true;
      return false;
    },
  },
  computed: {
    ...mapState({
      reportsData: (state) => state.report.reportsData,
    }),
    findOne() {
      return this.reportsData.find((el) => el.mId === +this.$route.query.edit);
    },
  },
  mounted() {
    const findOne = this.reportsData.find(
      (el) => el.mId === +this.$route.query.edit
    );
    if (findOne) {
      this.name = findOne.userName;
      this.nameFiledIsFocus = true;

      this.reportNameFildFocus = true;
      this.reportName = findOne.reportName;

      this.description = findOne.report;
      this.descriptionFiledFocus = true;

      this.time = findOne.time;
    }
  },
};
</script>

<style lang="scss">
.v-toast__item {
  border-radius: 50px;
}
.create-report {
  .desc {
    margin-bottom: 2rem;
    display: inline-block;
  }
  .card-content {
    padding: 10px !important;
  }
}
.mx-icon-clear {
  display: none !important;
}
.mx-icon-calendar {
  display: block !important;
}
.mx-datepicker {
  padding: 0 10px;
  width: 100%;
}
.mx-datepicker-content {
  th {
    text-align: center;
  }
  .cell {
    div {
      text-align: center !important;
    }
  }
}

.create-report {
  .helper-text {
    color: red;
  }
  .form-input {
    position: relative;
    z-index: 100;
  }
  .form-label {
    z-index: 1;
  }
  margin-top: 2rem;
  span.invalid {
    color: #f44336;
  }
}
</style>