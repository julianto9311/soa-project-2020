const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
var request = require('request');

router.use(express.urlencoded({extended:true}));

//13 cari lokasi terkenal pake lat long
router.get("/lokasi_terkenal",async function(req,res){
    var lokasi = req.query.lokasi;
    try {
        var tempat = await lokasi_ke_latlon(lokasi);
        try {
            var hasil = await lokasi_terkenal(tempat.lat,tempat.long);
            hasil = hasil.results[0];
            tempat = [];
            for (let i = 0; i < hasil.pois.length; i++) {
                const element = hasil.pois[i];
                
                tempat.push({"nama":element.name,"deksripsi":element.snippet});
            }            
            res.send(tempat);
        } catch (error) {
            console.log(error)
        }
    } catch (error){
        res.status(400).send(error)
    }
});
//14 dapat mengatur holiday plan selama 3 hari - day planner
router.get("/planner",async function(req,res){
    var lokasi = req.query.lokasi;
    var mulai = req.query.mulai;
    var selesai = req.query.selesai;
    try {
        var hasil = await planner(mulai,selesai,lokasi);
        hasil = hasil.results[0];
        console.log(hasil)
        plan= [];
        hasil.days.forEach(e=>{
            temp=[];
            e.itinerary_items.forEach(el=>{
                temp.push({"kegiatan":el.title,"nama":el.poi.name,"deskripsi":el.description})
            });
            console.log(temp)
            plan.push({"tanggal":e.date,"isi":temp});
        });      
        console.log(plan);  
        res.send(plan);
            
    } catch (error){
        res.status(400).send(error)
    }
});
//15
router.get("/aktifitas_terkenal",async function(req,res){
    var lokasi = req.query.lokasi;
    try {
        var tempat = await lokasi_ke_latlon(lokasi);
        try {
            var hasil = await aktifitas_terkenal(tempat.lat,tempat.long);
            hasil = hasil.results[0].scores;
            aktifitas = [];
            for (let i = 0; i < hasil.length; i++) {
                const element = hasil[i];
                aktifitas.push({"aktifitas":element.tag_label,"jumlah":element.count});
            }            
            res.send(aktifitas);
        } catch (error) {
            console.log(error)
        }
    } catch (error){
        res.status(400).send(error)
    }
});
//16cari poi terkenal lokasi
router.get("/poi_terkenal",async function(req,res){
    var lokasi = req.query.lokasi;
    try {
        var hasil = await poi_terkenal(lokasi);
        hasil = hasil.results;
        console.log(hasil)
        poi= [];
        hasil.forEach(e=>{
            poi.push({"nama":e.name,"deskripsi":e.snippet});
        });      
        console.log(poi);  
        res.send(poi);
    } catch (error){
        res.status(400).send(error)
    }
});

//api kosmas
const token_triposo_cosmas = "1kkv941t1156p94jxfpa7n9aobk0sy2p";
const acc_id_cosmas = "PHF5YXPM";
//api buat convert nama tempat jadi lat long
function lokasi_ke_latlon(nama_lokasi){
    return new Promise(function(resolve,reject){
        var geocode_key ="321522618001743309683x5873";
        var url=`https://geocode.xyz/?locate=${nama_lokasi}&geoit=JSON&auth=${geocode_key}`;
        var request = require('request');
        var options = {
            'method': 'GET',
            'url': url};
        request(options, function (error, response) { 
            if (error) {reject (new Error(error))}
            else {
                const hasil=JSON.parse(response.body);
                const kembali = {"long":hasil.longt, "lat":hasil.latt};
                resolve(kembali);};});});}//api buat convert nama tempat jadi lat long
//13
function lokasi_terkenal(lat,long){
    return new Promise(function(resolve,reject){
        var url=`https://www.triposo.com/api/20200405/local_highlights.json?latitude=${lat}&longitude=${long}&poi_fields=id,name,coordinates,snippet&token=${token_triposo_cosmas}&account=${acc_id_cosmas}`;
        var request = require('request');
        var options = {
            'method': 'GET',
            'url': url};
        request(options, function (error, response) { 
            if (error) {reject (new Error(error))}
            else {
                const hasil=JSON.parse(response.body); 
                resolve(hasil);};}
        );
});}
//14
function planner(tanggal_mulai,tanggal_selesai,tempat){
    return new Promise(function(resolve,reject){
        var url=`https://www.triposo.com/api/20200405/day_planner.json?&start_date=${tanggal_mulai}&end_date=${tanggal_selesai}&location_id=${tempat}&token=${token_triposo_cosmas}&account=${acc_id_cosmas}`;
        console.log(url)
        var request = require('request');
        var options = {
            'method': 'GET',
            'url': url};
        request(options, function (error, response) { 
            if (error) {reject (new Error(error))}
            else {
                const hasil=JSON.parse(response.body); 
                resolve(hasil);};}
        );
});}
//15
function aktifitas_terkenal(lat,long){
    return new Promise(function(resolve,reject){
        var url=`https://www.triposo.com/api/20200405/local_score.json?&coordinates=${lat+","+long}&token=${token_triposo_cosmas}&account=${acc_id_cosmas}`;
        console.log(url)
        var request = require('request');
        var options = {
            'method': 'GET',
            'url': url};
        request(options, function (error, response) { 
            if (error) {reject (new Error(error))}
            else {
                const hasil=JSON.parse(response.body); 
                resolve(hasil);};}
        );
});}
//16
function poi_terkenal(tempat){
    return new Promise(function(resolve,reject){
        var url=`https://www.triposo.com/api/20200405/poi.json?&location_id=${tempat}&order_by=-score&token=${token_triposo_cosmas}&account=${acc_id_cosmas}`;
        console.log(url)
        var request = require('request');
        var options = {
            'method': 'GET',
            'url': url};
        request(options, function (error, response) { 
            if (error) {reject (new Error(error))}
            else {
                const hasil=JSON.parse(response.body); 
                resolve(hasil);};}
        );
});}

module.exports = router;