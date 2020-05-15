const express = require("express");
const router = express.Router();
const db=require("../models/db");
const jwt = require("jsonwebtoken");
var request = require('request');
router.use(express.urlencoded({extended:true}));

router.post("/register",async function(req,res){
    let email=req.body.email;
    let username=req.body.username;
    let nama_lengkap=req.body.nama_lengkap; 
    let nomor_hp=req.body.nomor_hp;
    let password=req.body.password;

    if(!password || !email || !username || !nama_lengkap || !nomor_hp){
        return res.status(400).send({
            "message":"data ada yang kosong"
        });
    }
    else{
        const conn=await db.getConnection();
        try {
            const data_user = await db.executeQuery(conn,`select * from user where email='${email}'`);
            if(data_user.length>0){
                conn.release();
                return res.status(400).send({
                    "message":"email pernah digunakan"
                });
            }
            else{
                const insert = await db.executeQuery(conn,`insert into user values(${null},'${email}','${username}','${nama_lengkap}','${nomor_hp}','${password}',0,0,10)`);
                conn.release();
                return res.status(200).send({
                    "message":"berhasil register"
                });
            }
        } catch (error) {
            return res.status(400).send(error);
        }
    }
});

router.post("/login",async function(req,res){
    let email=req.body.email;
    let password=req.body.password;

    if(!email || !password){
        return res.status(400).send({
            "message" : "ada data yang kosong"
        });
    }
    else{
        const conn=await db.getConnection();
        try {
            const data_user = await db.executeQuery(conn,`select * from user where email='${email}' and password='${password}'`);
            if(data_user.length>0){
                conn.release();
                const token = jwt.sign({ 
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),   
                    "email":email
                },"proyek_uas");
                res.status(200).send(token); 
            }
            else{
                return res.status(400).send({
                    "message" : "salah email atau password"
                });
            }
        } catch (error) {
            return res.status(400).send(error);
        }
    }
});

router.put("/edit_user",async function(req,res){
    let email=req.body.email;
    let username=req.body.username;
    let nama_lengkap=req.body.nama_lengkap; 
    let nomor_hp=req.body.nomor_hp;
    let password=req.body.password;
    let newpassword=req.body.newpassword;

    if(!password || !username || !nama_lengkap || !nomor_hp || !email){
        return res.status(400).send({
            "message":"data ada yang kosong"
        });
    }
    else{
        const conn=await db.getConnection();
        try {
            const data_user = await db.executeQuery(conn,`select * from user where email='${email}' and password='${password}'`);
            if(data_user.length>0){
                if(!newpassword){
                    const update = await db.executeQuery(conn,`update user set username='${username}',nama_lengkap='${nama_lengkap}',nomor_hp='${nomor_hp}' where email='${email}'`);
                }
                else{
                    const update = await db.executeQuery(conn,`update user set username='${username}',nama_lengkap='${nama_lengkap}',nomor_hp='${nomor_hp}',password='${newpassword}' where email='${email}'`);
                }
                conn.release();
                return res.status(200).send({
                    "message":"berhasil edit user"
                });
            }
            else{
                conn.release();
                return res.status(400).send({
                    "message" : "salah email atau password"
                });
            }
        } catch (error) {
            return res.status(400).send(error);
        }
    }
});
//https://www.triposo.com/api/20200405/location.json?part_of=France&tag_labels=city&count=10&fields=id,name,score,snippet&order_by=-score&token=owymkzfrhejlzq2psl0k0otvyvrczhyi&account=LNPHPM5C
function get_Top_city_in_country(API,ID_Akun,Negara){
    return new Promise(function(resolve,reject){
        var api_key=API;
        var negara=Negara;
        var Id_akun=ID_Akun;
        var url=`https://www.triposo.com/api/20200405/location.json?part_of=${negara}&tag_labels=city&count=10&fields=id,name,score,snippet&order_by=-score&token=${api_key}&account=${Id_akun}`;
        var request = require('request');
        var options = {
            'method': 'GET',
            'url': url
        };
        request(options, function (error, response) { 
            if (error) {reject (new Error(error))}
            else {
                const hasil=response.body;
                resolve(hasil);
            };
        });
    });
}
router.get("/get_Top_city_in_country",async function(req,res){
    let hasil=[];
    let kota_yang_dicari=req.query.dicari;
    try {
        let data_top_city=JSON.parse(await get_Top_city_in_country(req.query.api_key,req.query.id_akun,req.query.negara));
        data_top_city.results.forEach(element => {
            if(element.name.toUpperCase().includes(kota_yang_dicari.toUpperCase())){
                hasil.push({
                    id: element.id,
                    name: element.name,
                    Penjelasan: element.snippet
                })
            }
        });
        if(hasil.length>0){
            res.status(200).send(hasil);
        }
        else{
            res.status(404).send({
                "message":"kota tidak ditemukan"
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});
module.exports = router;