const { pembayarans, sequelize } = require("../models");
const db = require("../models");
const Pembayaran = db.pembayarans;
const Barang = db.barangs;
const Admin = db.admins;
const barangController = require("./barang.controller");
const Op = db.Sequelize.Op;

// Create and Save a new Pembayaran
exports.create = (req, res) => {
  if (
    !req.body.kode_pembayaran ||
    !req.body.bayar ||
    !req.body.kembalian ||
    !req.body.total_harga ||
    !req.body.adminId
  ) {
    res.status(500).send({
      message: "Please fill all forms",
    });
    return;
  }

  const pembayarans = {
    kode_pembayaran: req.body.kode_pembayaran,
    tgl_pembayaran: new Date(),
    bayar: req.body.bayar,
    kembalian: parseInt(req.body.kembalian),
    total_harga: req.body.total_harga,
    adminId: req.body.adminId,
  };

  Pembayaran.create(pembayarans)
    .then((data) => {
      res.send({ status: "success", data: data });
    })
    .catch((error) => {
      res.status(500).send({ status: error.message });
    });
};

// Retrieve all barang from the database.
exports.findAll = (req, res) => {
  const search = req.query.search;
  const condition = search
    ? {
        kode_pembayaran: {
          [Op.like]: `%${search}%`,
        },
      }
    : null;

  Pembayaran.findAll({ order: [["id", "DESC"]], where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.status(500).send({ status: error.message });
    });
};

// Find a single Pembayaran with an id
exports.findOne = (req, res) => {
  const kode_pembayaran = req.params.kode_pembayaran;

  return Pembayaran.findOne({
    where: { kode_pembayaran: kode_pembayaran },
    include: [
      { model: Admin, as: "admin" },
      { model: Barang, as: "barangs" },
    ],
  })
    .then((pembayaran) => {
      res.send(pembayaran);
    })
    .catch((error) => {
      res.status(500).send({ status: error.message });
    });
};

exports.addBarang = (req, res) => {
  const id_pembayaran = req.body.id_pembayaran;
  const id_barang = req.body.id_barang;
  const jumlah_pembelian = req.body.jumlah_pembelian;

  return Pembayaran.findByPk(id_pembayaran)
    .then((pembayaran) => {
      if (!pembayaran) {
        res.status(500).send({
          message: "Pembayaran not found",
        });
        return;
      }

      return Barang.findByPk(id_barang).then((barang) => {
        if (!barang) {
          res.status(500).send({
            message: "Barang not found",
          });
          return;
        }

        pembayaran.addBarang(barang, {
          through: { jumlah_pembelian: jumlah_pembelian },
        });

        barangController.updateStok(id_barang, jumlah_pembelian);

        res.status(200).send({
          status: `added Barang id=${barang.id} to Pembayaran id=${pembayaran.id}`,
        });
      });
    })
    .catch((error) => {
      res.status(500).send({ status: error.message });
    });
};

exports.generateReport = (req, res) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);

  Pembayaran.findAll({
    where: { tgl_pembayaran: { [Op.between]: [startDate, endDate] } },
    include: [{ model: Barang, as: "barangs" }],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.status(500).send({ status: error.message });
    });
};
