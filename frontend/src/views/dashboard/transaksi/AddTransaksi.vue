<template>
  <div class="row">
    <div class="col-12 col-lg-7">
      <Card>
        <template v-slot:header>Tambah Transaksi</template>
        <template v-slot:content>
          <div class="mb-3">
            <label for="kode" class="form-label">Kode Barang</label>
            <div class="row">
              <div class="col col-md-9 col-xl-10">
                <input
                  type="number"
                  class="form-control"
                  id="kode"
                  v-model="search"
                  @keyup.enter="searchBarang"
                />
              </div>
              <div class="col">
                <a href="#" @click="searchBarang" class="btn btn-md btn-primary"
                  ><i class="fas fa-search"></i
                ></a>
              </div>
            </div>
            <span class="text-danger" v-if="invalid"
              >Kode barang tidak ditemukan!</span
            >
          </div>
          <div class="mb-3">
            <label for="nama_barang" class="form-label">Nama Barang</label>
            <input
              type="text"
              class="form-control"
              id="nama_barang"
              v-model="barang.nama"
              disabled
            />
          </div>
          <div class="mb-3">
            <label for="stok" class="form-label">Stok Barang</label>
            <input
              type="number"
              class="form-control"
              id="stok"
              v-model="barang.stok"
              disabled
            />
          </div>
          <div class="mb-3">
            <label for="harga" class="form-label">Harga Satuan</label>
            <input
              type="number"
              class="form-control"
              id="harga"
              v-model="barang.harga"
              disabled
            />
          </div>
          <div class="mb-3">
            <label for="jumlah" class="form-label">Jumlah Beli</label>
            <input
              type="number"
              onkeypress="return event.charCode >= 48"
              min="1"
              class="form-control"
              v-model="barang.jumlah_beli"
              id="jumlah"
            />
          </div>
          <div class="mb-3">
            <a class="btn btn-warning mr-3" @click="addToCart" v-if="isEditted"
              >Update Keranjang</a
            >
            <a class="btn btn-primary mr-3" @click="addToCart" v-else
              >Tambah ke Keranjang</a
            >
          </div>
        </template>
      </Card>
    </div>
    <div class="col-12 col-lg-5">
      <Card>
        <template v-slot:header>Total Transaksi</template>
        <template v-slot:content>
          <div class="mb-3">
            <label for="total" class="form-label">Total Harga</label>
            <input
              type="number"
              class="form-control"
              id="total"
              v-model="total"
              disabled
            />
          </div>
          <div class="mb-3">
            <label for="bayar" class="form-label">Bayar</label>
            <input
              type="number"
              class="form-control"
              onkeypress="return event.charCode >= 48"
              min="1"
              id="Bayar"
              v-model="bayar"
              @input="setKembalian"
            />
          </div>
          <div class="mb-3">
            <label for="kembalian" class="form-label">Kembalian</label>
            <input
              type="number"
              class="form-control"
              id="kembalian"
              v-model="kembalian"
              disabled
            />
          </div>
        </template>
      </Card>
    </div>
  </div>

  <Table class="mt-1">
    <template v-slot:header>Keranjang Belanja</template>
    <template v-slot:addButton>
      <button class="btn btn-primary btn-md mb-3 mr-2" @click="prosesTransaksi">
        Proses & Cetak Struk
      </button>
      <button class="btn btn-danger btn-md mb-3" @click="resetCart">
        Reset
      </button>
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
            <th>Jumlah Beli</th>
            <th>Harga Satuan</th>
            <th>Subtotal</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in cart">
            <td>{{ index + 1 }}</td>
            <td>{{ data.kode_barang }}</td>
            <td>{{ data.nama }}</td>
            <td>{{ data.jumlah_beli }}</td>
            <td>{{ data.harga }}</td>
            <td>{{ data.subTotal }}</td>
            <td>
              <a class="btn btn-sm btn-warning mr-2" @click="editItem(index)"
                >Edit</a
              >
              <a class="btn btn-sm btn-danger mr-2" @click="deleteItem(index)"
                >Hapus</a
              >
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
import Card from "@/components/Card.vue";
import Table from "@/components/Table.vue";

export default {
  data() {
    return {
      search: "",
      barang: {
        id: null,
        kode_barang: null,
        nama: null,
        stok: null,
        harga: null,
        jumlah_beli: null,
      },
      cart: [],
      total: 0,
      bayar: "",
      kembalian: 0,
      invalid: false,
      cek_kode: [],
      isEditted: false,
      isError: false,
    };
  },
  components: { Card, Table },
  methods: {
    async searchBarang() {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/barang/${this.search}`
        );
        if (res.data) {
          this.barang = {
            id: res.data.id,
            kode_barang: res.data.kode_barang,
            nama: res.data.nama,
            stok: res.data.stok,
            harga: res.data.harga,
          };

          this.invalid = false;
        } else {
          this.invalid = true;
          this.barang = {};
        }
      } catch (error) {
        console.log(error);
      }
    },
    addToCart() {
      const condition =
        this.barang.kode_barang !== null &&
        this.barang.nama !== null &&
        this.barang.stok !== null &&
        this.barang.harga !== null &&
        this.barang.jumlah_beli !== undefined;

      if (
        condition &&
        !this.cek_kode.includes(this.barang.kode_barang) &&
        this.barang.jumlah_beli <= this.barang.stok
      ) {
        const item = {
          id: this.barang.id,
          kode_barang: this.barang.kode_barang,
          nama: this.barang.nama,
          stok: this.barang.stok,
          harga: this.barang.harga,
          jumlah_beli: this.barang.jumlah_beli,
          subTotal: this.barang.harga * this.barang.jumlah_beli,
        };

        this.cart.push(item);
        this.cek_kode.push(item.kode_barang);
        this.search = "";
        this.barang = "";
        this.totalHarga();
      } else if (
        condition &&
        this.cek_kode.includes(this.barang.kode_barang) &&
        this.barang.jumlah_beli <= this.barang.stok
      ) {
        this.cart.forEach((item, index) => {
          if (item.kode_barang === this.barang.kode_barang) {
            if (this.isEditted === true) {
              item.jumlah_beli = this.barang.jumlah_beli;
              this.isEditted = false;
            } else {
              item.jumlah_beli += this.barang.jumlah_beli;
            }
            item.subTotal = item.jumlah_beli * this.barang.harga;
            index + 1;
          } else if (item.kode_barang !== this.barang.kode_barang) {
            this.cart.forEach((item, index) => {
              if (item.kode_barang === this.barang.kode_barang) {
                if (this.isEditted === true) {
                  item.jumlah_beli = this.barang.jumlah_beli;
                  this.isEditted = false;
                } else {
                  item.jumlah_beli += this.barang.jumlah_beli;
                }
                item.subTotal = item.jumlah_beli * this.barang.harga;
                index + 1;
              }
            });
          }
          this.search = "";
          this.barang = "";
          this.totalHarga();
        });
      } else if (this.barang.jumlah_beli > this.barang.stok) {
        Swal.fire({
          title: "Error!",
          text: "Jumlah pembelian melebihi stok",
          icon: "error",
          confirmButtonText: "Confirm",
        });
      } else if (parseInt(this.kembalian) < 0) {
        Swal.fire({
          title: "Error!",
          text: "Jumlah pembayaran kurang!",
          icon: "error",
          confirmButtonText: "Confirm",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Form transaksi tidak boleh kosong!",
          icon: "error",
          confirmButtonText: "Confirm",
        });
      }
    },
    totalHarga() {
      this.total = 0;
      this.cart.forEach((item) => {
        this.total += item.subTotal;
      });
    },
    goToPrint(kode) {
      let route = this.$router.resolve({
        name: "StrukTransaksi",
        params: { kode_transaksi: kode },
      });
      const struk = window.open(route.href, "", "status=0");
      struk.print();
    },
    resetCart() {
      this.cart = [];
      this.cek_kode = [];
      this.total = 0;
    },
    editItem(i) {
      this.isEditted = true;

      this.cart.filter((item, index) => {
        if (index === i) {
          this.search = item.kode_barang;
          this.barang = {
            id: item.id,
            kode_barang: item.kode_barang,
            nama: item.nama,
            stok: item.stok,
            harga: item.harga,
            jumlah_beli: item.jumlah_beli,
          };
        }
      });
    },
    deleteItem(i) {
      this.cart = this.cart.filter((item, index) => index !== i);
      this.cek_kode = this.cek_kode.filter((item, index) => index !== i);
      this.totalHarga();
    },
    setKembalian() {
      if (this.bayar !== "") {
        this.kembalian = this.bayar - this.total;
        console.log(this.kembalian < 0);
      } else {
        this.kembalian = 0;
      }
    },
    async prosesTransaksi() {
      if (this.cart.length < 1) {
        Swal.fire({
          title: "Error!",
          text: "Keranjang belanja tidak boleh kosong!",
          icon: "error",
          confirmButtonText: "Confirm",
        });
      } else if (this.bayar === "") {
        Swal.fire({
          title: "Error!",
          text: "Pembayaran tidak boleh kosong!",
          icon: "error",
          confirmButtonText: "Confirm",
        });
      } else if (this.kembalian < 0) {
        Swal.fire({
          title: "Error!",
          text: "Jumlah pembayaran kurang!",
          icon: "error",
          confirmButtonText: "Confirm",
        });
      } else {
        const kode_pembayaran = Math.random().toString(36).substr(2, 12);
        try {
          const res = await axios.post(
            "http://localhost:8080/api/pembayaran/add/",
            {
              kode_pembayaran: kode_pembayaran,
              bayar: this.bayar,
              kembalian: this.kembalian == 0 ? "0" : this.kembalian,
              total_harga: this.total,
              adminId: parseInt(localStorage.getItem("id")),
            }
          );

          if (res.status == 200) {
            this.cart.forEach((item) => {
              let pembayaran_barang = {
                id_pembayaran: res.data.data.id,
                id_barang: item.id,
                jumlah_pembelian: item.jumlah_beli,
              };

              axios
                .post(
                  "http://localhost:8080/api/pembayaran/addpembayaran",
                  pembayaran_barang
                )
                .then((response) => {
                  if (response.status == 200) {
                    Swal.fire({
                      icon: "success",
                      title: "Pembayaran berhasil dilakukan",
                      showConfirmButton: false,
                      timer: 1500,
                    });

                    this.cart = [];
                    this.cek_kode = [];
                    this.total = 0;
                    this.bayar = "";
                    this.kembalian = 0;

                    this.isError = false;
                  }
                })
                .catch((error) => {
                  Swal.fire({
                    title: "Error!",
                    text: "Terjadi kesalahan dalam transaksi!",
                    icon: "error",
                    confirmButtonText: "Confirm",
                  });
                  this.isError = true;
                  console.log(error);
                });
            });

            if (this.isError === false) {
              this.goToPrint(res.data.data.kode_pembayaran);
            }
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    },
  },
};
</script>

<style></style>
