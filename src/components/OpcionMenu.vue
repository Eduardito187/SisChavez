<template>
  <div class="OpcionMenu">
    <div style="width:100%;height:auto;margin-bottom:2px;">
      <b-skeleton-wrapper :loading="loading">
        <template #loading>
          <b-card>
            <b-skeleton width="85%"></b-skeleton>
          </b-card>
        </template>

        <b-card @click="ir_url()" style="cursor:pointer;">
          {{ nombre }}
        </b-card>
      </b-skeleton-wrapper>
    </div>
  </div>
</template>

<script>
export default {
  name: "OpcionMenu",
  data() {
    return {
      loading: false,
      loadingTime: 0,
      maxLoadingTime: 3
    };
  },
  props: {
    nombre: {
      type: String
    },
    icono: {
      type: String
    },
    url: {
      type: String
    }
  },
  watch: {
    loading(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.clearLoadingTimeInterval();

        if (newValue) {
          this.$_loadingTimeInterval = setInterval(() => {
            this.loadingTime++;
          }, 1000);
        }
      }
    },
    loadingTime(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue === this.maxLoadingTime) {
          this.loading = false;
        }
      }
    }
  },
  created() {
    this.$_loadingTimeInterval = null;
  },
  mounted() {
    this.startLoading();
  },
  methods: {
    clearLoadingTimeInterval() {
      clearInterval(this.$_loadingTimeInterval);
      this.$_loadingTimeInterval = null;
    },
    startLoading() {
      this.loading = true;
      this.loadingTime = 0;
    },
    ir_url() {
      this.$router.push(this.url);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
