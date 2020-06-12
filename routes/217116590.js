const express = require("express");
const request = require('request');
const db = require("../models/db");
const jwt = require("jsonwebtoken");
const numeral = require('numeral');
const router = express.Router();
const midtransClient = require('midtrans-client');
router.use(express.urlencoded({extended:true}));

router.get("/article", async function(req,res){
    let kota = req.query.kota;

    let token = req.query.token;
    let user;

    if(!token)return res.status(401).send("Token not found");
    try{
        user = jwt.verify(token,"proyek_uas");
    }catch(err){
        return res.status(401).send("Token Invalid");
    }
    if(kota=="")return res.status(400).send({message: "Field ada yang kosong"});
    else{
        const conn = await db.getConnection();
        let cek = await db.executeQuery(conn,`select * from user where email = '${user.email}'`);
        if(cek.length > 0){
            if(parseInt(cek[0].api_hit) - 1 >= 0){
                let api_hit = parseInt(cek[0].api_hit) - 1;
                let update = await db.executeQuery(conn,`update user set api_hit = ${api_hit} where email = '${user.email}'`);
                conn.release();

                let params = {
                    account: process.env.JULI_TRIPOSO_ACCID,
                    token: process.env.JULI_TRIPOSO_TOKEN,
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
                        else res.status(404).send({Message:"Perayaan tidak ditemukan"});
                    });
                } catch (error) {
                    res.status(400).send(error);
                }
            }
            else return res.status(400).send({message: "Api hit tidak cukup"});
        }
        else return res.status(400).send({message: "User tidak ditemukan"});
    }
});

router.get("/city_walk", async function(req,res){
    let kota = req.query.kota;
    let waktu = req.query.waktu;
    
    let token = req.query.token;
    let user;

    if(!token)return res.status(401).send("Token not found");
    try{
        user = jwt.verify(token,"proyek_uas");
    }catch(err){
        return res.status(401).send("Token Invalid");
    }
    if(kota==""||waktu=="")return res.status(400).send({message: "Field ada yang kosong"});
    else{
        const conn = await db.getConnection();
        let cek = await db.executeQuery(conn,`select * from user where email = '${user.email}'`);
        if(cek.length > 0){
            if(parseInt(cek[0].api_hit) - 1 >= 0){
                let api_hit = parseInt(cek[0].api_hit) - 1;
                let update = await db.executeQuery(conn,`update user set api_hit = ${api_hit} where email = '${user.email}'`);
                conn.release();

                let params = {
                    account: process.env.JULI_TRIPOSO_ACCID,
                    token: process.env.JULI_TRIPOSO_TOKEN,
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
                            else res.status(404).send({Message:"City Walk tidak ditemukan"});
                        } catch (error) {
                            res.status(400).send({Message:"City Walk tidak ditemukan"});
                        }
                    });
                } catch (error) {
                    res.status(400).send(error);
                }
            }
            else return res.status(400).send({message: "Api hit tidak cukup"});
        }
        else return res.status(400).send({message: "User tidak ditemukan"});
    }
});

router.get("/tour", async function(req,res){
    let kota = req.query.kota;
    let kegiatan = req.query.kegiatan;
    let params;

    let token = req.query.token;
    let user;

    if(!token)return res.status(401).send("Token not found");
    try{
        user = jwt.verify(token,"proyek_uas");
    }catch(err){
        return res.status(401).send("Token Invalid");
    }
    if(kota==""||kegiatan=="")return res.status(400).send({message: "Field ada yang kosong"});
    else{
        const conn = await db.getConnection();
        let cek = await db.executeQuery(conn,`select * from user where email = '${user.email}'`);
        conn.release();
        if(cek.length > 0){
            if(parseInt(cek[0].api_hit) - 1 >= 0){
                if(kegiatan){
                    params = {
                        account: process.env.JULI_TRIPOSO_ACCID,
                        token: process.env.JULI_TRIPOSO_TOKEN,
                        fields: 'id,name',
                        order_by: '-score',
                        location_ids: kota,
                        tag_labels: kegiatan
                    };
                }
                else{
                    params = {
                        account: process.env.JULI_TRIPOSO_ACCID,
                        token: process.env.JULI_TRIPOSO_TOKEN,
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
            }
            else return res.status(400).send({message: "Api hit tidak cukup"});
        }
        else return res.status(400).send({message: "User tidak ditemukan"});
    }
});

router.get("/tour/:id", async function(req,res){
    let id = req.params.id;
    let token = req.query.token;
    let user;

    if(!token)return res.status(401).send("Token not found");
    try{
        user = jwt.verify(token,"proyek_uas");
    }catch(err){
        return res.status(401).send("Token Invalid");
    }
    if(id=="")return res.status(400).send({message: "Field ada yang kosong"});
    else{
        const conn = await db.getConnection();
        let cek = await db.executeQuery(conn,`select * from user where email = '${user.email}'`);
        conn.release();
        if(cek.length > 0){
            if(parseInt(cek[0].api_hit) - 1 >= 0){
                let params = {
                    account: process.env.JULI_TRIPOSO_ACCID,
                    token: process.env.JULI_TRIPOSO_TOKEN,
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
                                // Harga: element.price.currency + " " + element.price.amount,
                                Harga: "Rp. " + numeral(parseInt(element.price.amount) * 16260).format('0,0'),
                                Harga_Per_Orang: orang,
                                URL: element.vendor_tour_url,
                                Deskripsi: element.intro,
                            });
                        });
                        if(hasil.length>0)res.status(200).send(hasil);
                        else res.status(404).send({Message:"Tour tidak ditemukan"});
                    });
                } catch (error) {
                    res.status(400).send(error);
                }
            }
            else return res.status(400).send({message: "Api hit tidak cukup"});
        }
        else return res.status(400).send({message: "User tidak ditemukan"});
    }
});

router.post("/review", async function(req,res){
    let token = req.query.token;
    let id_jenis = req.body.id;
    let nama_jenis = req.body.nama;
    let jenis = req.body.jenis;
    let comment = req.body.comment;
    let rating = req.body.rating;
    let user;

    if(!token)return res.status(401).send("Token not found");
    try{
        user = jwt.verify(token,"proyek_uas");
    }catch(err){
        return res.status(401).send("Token Invalid");
    }
    if(id_jenis==""||nama_jenis==""||jenis==""||comment==""||rating=="")return res.status(400).send({message: "Field ada yang kosong"});
    else{
        const conn = await db.getConnection();
        let cek = await db.executeQuery(conn,`select * from user where email = '${user.email}'`);
        if(cek.length > 0){
            if(user.tipe_user>0){
                if(parseInt(cek[0].api_hit) - 1 >= 0){
                    let api_hit = parseInt(cek[0].api_hit) - 1;
                    let update = await db.executeQuery(conn,`update user set api_hit = ${api_hit} where email = '${user.email}'`);
                    let insert = await db.executeQuery(conn,`insert into review values('','${user.email}','${id_jenis}','${nama_jenis}','${jenis}','${comment}',${rating})`);
                    conn.release();
                    return res.status(200).send({message: "Review berhasil ditambahkan"});
                }
                else return res.status(400).send({message: "Api hit tidak cukup"});
            }
            else return res.status(403).send({message: "Endpoint ini hanya untuk premium user"});
        }
        else return res.status(400).send({message: "User tidak ditemukan"});
    }
});

router.get("/review", async function(req,res){
    let token = req.query.token;
    let user;

    if(!token)return res.status(401).send("Token not found");
    try{
        user = jwt.verify(token,"proyek_uas");
    }catch(err){
        return res.status(401).send("Token Invalid");
    }
    const conn = await db.getConnection();
    let cek = await db.executeQuery(conn,`select * from user where email = '${user.email}'`);
    if(cek.length > 0){
        let api_hit = parseInt(cek[0].api_hit) - 1;
        let update = await db.executeQuery(conn,`update user set api_hit = ${api_hit} where email = '${user.email}'`);
        let tampil = await db.executeQuery(conn,`select * from review`);
        conn.release();
        let hasil = [];
        tampil.forEach(e => {
            hasil.push({
                Email_Reviewer: e.email,
                Nama_Jenis: e.nama_jenis,
                Jenis: e.jenis,
                Comment: e.comment,
                Rating: e.rating
            });
        });
        return res.status(200).send(hasil);   
    }
    else return res.status(400).send({message: "User tidak ditemukan"});
});

router.get("/review/:id", async function(req,res){
    let tour = req.params.id;
    let token = req.query.token;
    let user;

    if(!token)return res.status(401).send("Token not found");
    try{
        user = jwt.verify(token,"proyek_uas");
    }catch(err){
        return res.status(401).send("Token Invalid");
    }
    const conn = await db.getConnection();
    let cek = await db.executeQuery(conn,`select * from user where email = '${user.email}'`);
    if(cek.length > 0){
        if(user.tipe_user>0){
            let api_hit = parseInt(cek[0].api_hit) - 1;
            let update = await db.executeQuery(conn,`update user set api_hit = ${api_hit} where email = '${user.email}'`);
            let tampil = await db.executeQuery(conn,`select * from review where id_jenis = '${tour}'`);
            conn.release();
            let temp = [];
            tampil.forEach(e => {
                temp.push({
                    Email_Reviewer: e.email,
                    Jenis: e.jenis,
                    Comment: e.comment,
                    Rating: e.rating
                });
            });
            let hasil = {
                Nama_Jenis: tampil[0].nama_jenis,
                Comment: temp
            }
            return res.status(200).send(hasil);
        }
        else return res.status(403).send({message: "Endpoint ini hanya untuk premium user"});
    }
    else return res.status(400).send({message: "User tidak ditemukan"});
});

//contoh url ejs
//http://localhost:3000/217116590/Halaman_TopUp_Saldo?email=julianto@gmail.com&password=123&jumlah=300000
router.get("/Halaman_TopUp_Saldo", async function(req,res){
    let email = req.query.email;
    let password = req.query.password;
    let jumlah = req.query.jumlah;
    if(email==""||password==""||jumlah=="")return res.status(400).send({message: "Field ada yang kosong"});
    else{
        const conn = await db.getConnection();
        let cek = await db.executeQuery(conn,`select * from user where email = '${email}' and password = '${password}'`);
        if(cek.length > 0){
            let snap = new midtransClient.Snap({
                isProduction : false,
                serverKey : 'SB-Mid-server-ATA7A68g5F0til1QsrQaqkwm',
                clientKey : 'SB-Mid-client-TsfOqnDmOESCA2Fl'
            });
            let parameter = {
                "transaction_details": {
                "order_id": "order-id-node-"+Math.round((new Date()).getTime() / 1000),
                "gross_amount": jumlah
                }, "credit_card":{
                "secure" : true
                }
            };
            conn.release();
            snap.createTransactionToken(parameter).then((transactionToken)=>{
                res.render('top_up_saldo',{
                    token: transactionToken, 
                    clientKey: snap.apiConfig.clientKey,
                    jumlah:jumlah,
                    password:password,
                    email:email
                })
            });
        }
        else return res.status(400).send({message: "Email atau Password salah"});
    }
});

//redirect yang dilakukan setelah berhasil bayar
router.post("/Tambah_Saldo", async function(req,res){
    
    let email = req.body.email;
    let password = req.body.password;
    let jumlah = req.body.jumlah;
    const conn = await db.getConnection();
    try {
        let cek = await db.executeQuery(conn,`select * from user where email = '${email}' and password = '${password}'`);
        let saldo = parseInt(cek[0].saldo) + parseInt(jumlah);
        let update = await db.executeQuery(conn,`update user set saldo = ${saldo} where email = '${email}'`);
        conn.release();
    } catch (error) {
        return res.status(500).send({message: "Topup gagal"});
    }
            
});

//harga subscribe 500.000
router.post("/subscribe", async function(req,res){
    let email = req.body.email;
    let password = req.body.password;

    if(email==""||password=="")return res.status(400).send({message: "Field ada yang kosong"});
    else{
        const conn = await db.getConnection();
        let cek = await db.executeQuery(conn,`select * from user where email = '${email}' and password = '${password}'`);
        if(cek.length > 0){
            if(parseInt(cek[0].tipe_user) == 0){
                if(parseInt(cek[0].saldo) - 500000 >= 0){
                    let saldo = parseInt(cek[0].saldo) - 500000;
                    let update = await db.executeQuery(conn,`update user set saldo = ${saldo}, tipe_user = 1 where email = '${email}'`);
                    conn.release();
                    return res.status(200).send({message: "Akun berhasil menjadi premium"});
                }
                else return res.status(400).send({message: "Saldo tidak cukup"});
            }
            else return res.status(403).send({message: "Akun sudah premium"});
        }
        else return res.status(400).send({message: "Email atau Password salah"});
    }
});

module.exports = router;