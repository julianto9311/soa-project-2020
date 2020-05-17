const express = require("express");
const request = require('request');
const conn = require("../connection");
const router = express.Router();

router.get("/article", function(req,res){
    let kota = req.query.kota;
    let params = {
        account: '9ENBBSQ4',
        token: 'rsw63pdoiak7hm9ki4nwt4angm9ul34t',
        fields: 'name,intro',
        order_by: '-score',
        location_ids: kota,
        tag_labels: 'celebrations'
    };
    let options = {
        url:'https://www.triposo.com/api/20200405/article.json',
        method: 'GET',
        qs:params
    };
    try {
        request(options, function (error, response) {
            let temp = JSON.parse(response.body);
            let hasil = [];
            temp.results.forEach(element => {
                hasil.push({
                    Nama_Perayaan: element.name,
                    Deskripsi: element.intro
                });
            });
            if(hasil.length>0)res.status(200).send(hasil);
            else res.status(400).send({Message:"Perayaan tidak ditemukan"});
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/city_walk", function(req,res){
    let kota = req.query.kota;
    let waktu = req.query.waktu;
    let params = {
        account: '9ENBBSQ4',
        token: 'rsw63pdoiak7hm9ki4nwt4angm9ul34t',
        location_id: kota,
        tag_labels: 'sightseeing',
        total_time: waktu,
        optimal: true
    };
    let options = {
        url:'https://www.triposo.com/api/20200405/city_walk.json',
        method: 'GET',
        qs:params
    };
    try {
        request(options, function (error, response) {
            let temp = JSON.parse(response.body);
            try {
                let tujuan = [];
                temp.results[0].way_points.forEach(element => {
                    tujuan.push({
                        Nama_Tempat: element.poi.name,
                        Deskripsi: element.poi.snippet,
                        Waktu_Berhenti: element.visit_time + " menit",
                        Jarak_Ke_Tempat_Berikutnya: element.walk_to_next_distance + " meter",
                        Waktu_Ke_Tempat_Berikutnya: element.walk_to_next_duration + " menit"
                    });
                });
                let hasil = [];
                temp.results.forEach(element => {
                    hasil.push({
                        Jarak_Berjalan: element.walk_distance + " meter",
                        Waktu_Berjalan: element.walk_duration + " menit",
                        Waktu_Total: element.total_duration + " menit",
                        Tujuan: tujuan
                    });
                });
                if(hasil.length>0)res.status(200).send(hasil);
                else res.status(400).send({Message:"City Walk tidak ditemukan"});
            } catch (error) {
                res.status(400).send({Message:"City Walk tidak ditemukan"});
            }
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/tour", function(req,res){
    let kota = req.query.kota;
    let kegiatan = req.query.kegiatan;
    let params;
    if(kegiatan){
        params = {
            account: '9ENBBSQ4',
            token: 'rsw63pdoiak7hm9ki4nwt4angm9ul34t',
            fields: 'id,name',
            order_by: '-score',
            location_ids: kota,
            tag_labels: kegiatan
        };
    }
    else{
        params = {
            account: '9ENBBSQ4',
            token: 'rsw63pdoiak7hm9ki4nwt4angm9ul34t',
            fields: 'id,name',
            order_by: '-score',
            location_ids: kota
        };
    }
    let options = {
        url:'https://www.triposo.com/api/20200405/tour.json',
        method: 'GET',
        qs:params
    };
    try {
        request(options, function (error, response) {
            let temp = JSON.parse(response.body);
            let hasil = [];
            temp.results.forEach(element => {
                hasil.push({
                    ID_Tour: element.id,
                    Nama_Tour: element.name
                });
            });
            if(hasil.length>0)res.status(200).send(hasil);
            else res.status(400).send({Message:"Tour tidak ditemukan"});
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/tour/:id", function(req,res){
    let id = req.params.id;
    let params = {
        account: '9ENBBSQ4',
        token: 'rsw63pdoiak7hm9ki4nwt4angm9ul34t',
        fields: 'name,price,vendor_tour_url,intro,price_is_per_person',
        order_by: '-score',
        id: id
    };
    let options = {
        url:'https://www.triposo.com/api/20200405/tour.json',
        method: 'GET',
        qs:params
    };
    try {
        request(options, function (error, response) {
            let temp = JSON.parse(response.body);
            let hasil = [];
            temp.results.forEach(element => {
                let orang = element.price_is_per_person == true ? "Ya" : "Tidak";
                hasil.push({
                    Nama_Tour: element.name,
                    Harga: element.price.currency + " " + element.price.amount,
                    Harga_Per_Orang: orang,
                    URL: element.vendor_tour_url,
                    Deskripsi: element.intro,
                });
            });
            if(hasil.length>0)res.status(200).send(hasil);
            else res.status(400).send({Message:"Tour tidak ditemukan"});
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post("/tour/review", async function(req,res){
    let tour = req.query.tour;
    let token = req.headers('token');
    let comment = req.body.comment;
    let rating = req.body.rating;

    let user = jwt.decode(token);
    if(user){
        if(user.tipe>0){
            let cek = await (conn.query(`select * from account where username = '${user.username}'`));
            if(cek.length > 0){
                if(cek[0].api_hit - 1 >= 0){
                    let insert = await (conn.query(`insert into review values('','${user.username}','${tour}','${comment}',${rating})`));
                    return res.status(200).send({msg: "Review berhasil ditambahkan"});
                }
                else return res.status(400).send({msg: "Api hit tidak cukup"});
            }
            else return res.status(400).send({msg: "User tidak ditemukan"});
        }
        else return res.status(400).send({msg: "Endpoint ini hanya untuk premium user"});
    }
    else return res.status(400).send({msg: "Token tidak ditemukan"});
});

router.get("/tour/review", async function(req,res){
    let token = req.headers('token');

    let user = jwt.decode(token);
    if(user){
        if(user.tipe>0){
            let cek = await (conn.query(`select * from account where username = '${user.username}'`));
            if(cek.length > 0){
                if(cek[0].api_hit - 1 >= 0){
                    let tampil = await (conn.query(`select * from review`));
                    return res.status(200).send(tampil);
                }
                else return res.status(400).send({msg: "Api hit tidak cukup"});    
            }
            else return res.status(400).send({msg: "User tidak ditemukan"});
        }
        else return res.status(400).send({msg: "Endpoint ini hanya untuk premium user"});
    }
    else return res.status(400).send({msg: "Token tidak ditemukan"});
});

router.get("/tour/review/:id", async function(req,res){
    let tour = req.params.id;
    let token = req.headers('token');

    let user = jwt.decode(token);
    if(user){
        if(user.tipe>0){
            let cek = await (conn.query(`select * from account where username = '${user.username}'`));
            if(cek.length > 0){
                if(cek[0].api_hit - 1 >= 0){
                    let tampil = await (conn.query(`select * from review where id_tour = '${tour}'`));
                    return res.status(200).send(tampil);
                }
                else return res.status(400).send({msg: "Api hit tidak cukup"});
            }
            else return res.status(400).send({msg: "User tidak ditemukan"});
        }
        else return res.status(400).send({msg: "Endpoint ini hanya untuk premium user"});
    }
    else return res.status(400).send({msg: "Token tidak ditemukan"});
});

router.post("/saldo", async function(req,res){
    let token = req.headers('token');
    let jumlah = req.body.jumlah;

    let user = jwt.decode(token);
    if(user){
        let cek = await (conn.query(`select * from account where username = '${user.username}'`));
        if(cek.length > 0){
            let saldo = parseInt(cek[0].saldo) + parseInt(jumlah);
            let update = await (conn.query(`update account set saldo = ${saldo} where username = '${user.username}'`));
            return res.status(200).send({msg: "Saldo berhasil ditambahkan"});
        }
        else return res.status(400).send({msg: "User tidak ditemukan"});
    }
    else return res.status(400).send({msg: "Token tidak ditemukan"});
});

router.post("/api_hit", async function(req,res){
    let token = req.headers('token');
    let jumlah = req.body.jumlah;

    let user = jwt.decode(token);
    if(user){
        let cek = await (conn.query(`select * from account where username = '${user.username}'`));
        if(cek.length > 0){
            if(parseInt(cek[0].saldo) - (parseInt(jumlah) * 5000) >= 0){
                let saldo = parseInt(cek[0].saldo) - (parseInt(jumlah) * 5000);
                let api_hit = parseInt(cek[0].api_hit) + parseInt(jumlah);
                let update = await (conn.query(`update account set saldo = ${saldo}, api_hit = ${api_hit} where username = '${user.username}'`));
                return res.status(200).send({msg: "Api hit berhasil ditambahkan"});
            }
            else return res.status(400).send({msg: "Saldo tidak cukup"});
        }
        else return res.status(400).send({msg: "User tidak ditemukan"});
    }
    else return res.status(400).send({msg: "Token tidak ditemukan"});
});

router.post("/subscribe", async function(req,res){
    let token = req.headers('token');

    let user = jwt.decode(token);
    if(user){
        let cek = await (conn.query(`select * from account where username = '${user.username}'`));
        if(cek.length > 0){
            if(parseInt(cek[0].saldo) - 500000 >= 0){
                let saldo = parseInt(cek[0].saldo) - 500000;
                let update = await (conn.query(`update account set saldo = ${saldo}, tipe = 1 where username = '${user.username}'`));
                return res.status(200).send({msg: "Akun berhasil menjadi premium"});
            }
            else return res.status(400).send({msg: "Saldo tidak cukup"});
        }
        else return res.status(400).send({msg: "User tidak ditemukan"});
    }
    else return res.status(400).send({msg: "Token tidak ditemukan"});
});

module.exports = router;