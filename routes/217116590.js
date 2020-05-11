const express = require("express");
const request = require('request');
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

module.exports = router;