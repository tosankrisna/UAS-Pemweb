<template>
  <ul
    class="navbar-nav bg-primary sidebar sidebar-white accordion"
    :class="{ toggled: isToggle }"
    id="accordionSidebar"
  >
    <router-link
      class="sidebar-brand d-flex align-items-center justify-content-center"
      to="/"
    >
      <div class="sidebar-brand-icon rotate-n-15">
        <i class="fas fa-dollar-sign text-white"></i>
      </div>
      <div class="sidebar-brand-text text-white mx-3">Kasirku</div>
    </router-link>

    <hr class="sidebar-divider my-0" />

    <hr class="sidebar-divider" />

    <div class="sidebar-heading text-white">Menu</div>
    <li class="nav-item" v-if="level === 'admin'">
      <router-link class="nav-link" :to="{ name: 'Kasir' }">
        <i class="fas fa-user fa-cog text-white"></i>
        <span class="ml-md-3 text-white">Kasir</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="level === 'admin'">
      <router-link class="nav-link" :to="{ name: 'Barang' }">
        <i class="fas fa-shopping-bag fa-cog text-white"></i>
        <span class="ml-md-3 text-white">Barang</span>
      </router-link>
    </li>
    <li class="nav-item">
      <a href="#" class="nav-link collapsed" @click="toggleSubMenu">
        <i class="fas fa-hand-holding-usd fa-cog text-white"></i>
        <span class="ml-md-3 text-white">Transaksi</span>
        <i class="fas fa-chevron-down text-white chevron" v-if="!isToggle"></i>
      </a>
      <div
        id="collapseUtilities"
        class="collapse"
        :class="{ show: showSubMenu }"
      >
        <div class="bg-white collapse-inner rounded">
          <router-link
            v-if="level === 'kasir'"
            :to="{ name: 'AddTransaksi' }"
            class="collapse-item text-black"
            >Tambah Transaksi</router-link
          >
          <router-link
            :to="{ name: 'Transaksi' }"
            class="collapse-item text-black"
            >Data Transaksi</router-link
          >
        </div>
      </div>
    </li>
    <li class="nav-item" v-if="level === 'admin'">
      <router-link class="nav-link" :to="{ name: 'Report' }">
        <i class="fas fa-file-alt fa-cog text-white"></i>
        <span class="ml-md-3 text-white">Report</span>
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  props: ["isToggle"],
  data() {
    return {
      showSubMenu: false,
      level: "",
    };
  },
  methods: {
    getLevel() {
      this.level = localStorage.getItem("level");
    },
    toggleSubMenu() {
      this.showSubMenu = !this.showSubMenu;
    },
  },
  mounted() {
    this.getLevel();
  },
};
</script>

<style scoped>
.toggled span {
  margin-left: 0 !important;
}

.chevron {
  margin-left: 80px;
}

@media screen and (max-width: 500px) {
  .chevron {
    display: none;
  }
}
</style>
