<template>
  <Table>
    <template v-slot:header>Data Barang</template>
    <template v-slot:search>
      <Search @search-data="searchBarang" />
    </template>
    <template v-slot:addButton>
      <router-link :to="{ name: 'AddBarang' }" class="btn btn-primary btn-md"
        >Tambah Data</router-link
      >
    </template>
    <template v-slot:content>
      <table
        class="table table-bordered dataTable"
        id="dataTable"
        width="100%"
        cellspacing="0"
        role="grid"
        aria-describedby="dataTable_info"
        style="width: 100%"
      >
        <thead>
          <tr>
            <th>No</th>
            <th>Kode Barang</th>
            <th>Nama Barang</th>
            <th>Stok</th>
            <th>Harga</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody class="text-capitalize">
          <tr v-for="(data, index) in barang.slice().reverse()" :key="data.id">
            <td>{{ index + 1 }}</td>
            <td>{{ data.kode_barang }}</td>
            <td>{{ data.nama }}</td>
            <td>{{ data.stok }}</td>
            <td>Rp. {{ data.harga }}</td>
            <td>
              <router-link
                class="btn btn-sm btn-warning mr-2"
                :to="{
                  name: 'EditBarang',
                  params: { kode_barang: data.kode_barang },
                }"
                >Edit</router-link
              >
              <button
                class="btn btn-sm btn-danger"
                @click="deleteBarang(data.kode_barang)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </Table>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";
import Table from "@/components/Table.vue";
import Search from "@/components/Search.vue";

export default {
  name: "Barang",
  data() {
    return {
      barang: [],
    };
  },
  components: {
    Table,
    Search,
  },
  methods: {
    async getAllBarang() {
      try {
        const res = await axios.get("http://localhost:8080/api/barang");
        this.barang = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    deleteBarang(kode_barang) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            axios
              .delete(`http://localhost:8080/api/barang/delete/${kode_barang}`)
              .then(() => {
                this.barang = this.barang.filter(
                  (item) => item.kode_barang !== kode_barang
                );

                swalWithBootstrapButtons.fire(
                  "Deleted!",
                  "Your data has been deleted.",
                  "success"
                );
              })
              .catch((err) => console.log(err));
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire(
              "Cancelled",
              "Your data is safe :)",
              "error"
            );
          }
        });
    },
    async searchBarang(search) {
      try {
        const res = await axios.get(`http://localhost:8080/api/barang?search=${search}`);
        this.barang = res.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.getAllBarang();
  },
};
</script>
