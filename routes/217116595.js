const express = require("express");
const db = require("../models/db");
const jwt = require("jsonwebtoken");

const router = express.Router();
router.use(express.urlencoded({extended:true}));

function getRestaurant(country, label, jumlah){
    return new Promise(function(resolve, reject){
        var request = require('request');
        var options = {
            'method': 'GET',
            'url': `https://www.triposo.com/api/20200405/poi.json?tag_labels=${label}&location_id=${country}&count=${jumlah}&order_by=-score&fields=name,id&token=${process.env.FERED_TRIPOSO_TOKEN}&account=${process.env.FERED_TRIPOSO_ACCID}`
        };
        request(options, function (error, response) { 
            if (error) reject (new Error(error));
            else resolve(response.body);
        });
    });
}

router.get("/api/getRestaurant", async function(req, res){
    // if(req.params.country=="kosong"){
    //     res.status(400).send({"msg" : "Restaurant dengan negara kosong tidak ditemukan :("});
    // }
    // else if(req.params.jumlah=="0"){
    //     return res.status(404)
    //     .send({"msg":`Tidak akan keluar response kalau jumlah 0`});
    // }
    // else {
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
        if(cek[0].api_hit > 0){
            //UPDATE API_HIT
            let temp = cek[0].api_hit-1;
            let data = await db.executeQuery(conn,`update user set api_hit=${temp} where email = '${user.email}'`);

            //CALL 3RDAPI
            const restaurant = JSON.parse(await getRestaurant(req.query.country, req.query.label, req.query.jumlah));
            const cetak = [];
            restaurant.results.forEach(element => {
                cetak.push({
                    id: element.id,
                    name: element.name
                })
            });
            res.status(200).send(cetak);
        }
        else res.status(400).send("API HIT HABIS!!!");

        
    //     res.status(200).send({
    //         "id": "N__429735547",
    //         "name": "Clärchens Ballhaus"
    //     });
    // }
});


//===========================================================================================================================


function getSimilarPlace(country, jumlah){
    return new Promise(function(resolve, reject){
        var request = require('request');
        var options = {
            'method': 'GET',
            'url': `https://www.triposo.com/api/20200405/poi.json?location_id=${country}&count=${jumlah}&annotate=similarity:T__389cda256332&order_by=-similarity&fields=name,id&token=${process.env.FERED_TRIPOSO_TOKEN}&account=${process.env.FERED_TRIPOSO_ACCID}`
        };
        request(options, function (error, response) { 
            if (error) reject (new Error(error));
            else resolve(response.body);
        });
    });
}

router.get("/api/getSimilarPlace", async function(req, res){
    // if(req.params.country=="kosong"){
    //     res.status(400).send({"msg" : "Tempat dengan negara kosong tidak ditemukan :("});
    // }
    // else if(req.params.jumlah=="0"){
    //     return res.status(404)
    //     .send({"msg":`Tidak akan keluar response kalau jumlah 0`});
    // }
    // else {
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
        if(cek[0].api_hit > 0){
            //UPDATE API_HIT
            let temp = cek[0].api_hit-1;
            let data = await db.executeQuery(conn,`update user set api_hit=${temp} where email = '${user.email}'`);

            //CALL 3RDAPI
            const restaurant = JSON.parse(await getSimilarPlace(req.query.country, req.query.jumlah));
            const cetak = [];
            restaurant.results.forEach(element => {
                cetak.push({
                    id: element.id,
                    name: element.name
                })
            });
            res.status(200).send(cetak);
        }
        else res.status(400).send("API HIT HABIS!!!");

        

    //     res.status(200).send({
    //         "id": "T__b98be764da47",
    //         "name": "Ramen-Ya"
    //     });
    // }
});

//=====================================================================================================================


function getFoodDrink(country){
    return new Promise(function(resolve, reject){
        var request = require('request');
        var options = {
            'method': 'GET',
            'url': `https://www.triposo.com/api/20200405/tag.json?location_id=${country}&ancestor_label=cuisine&order_by=-score&fields=name,label&token=${process.env.FERED_TRIPOSO_TOKEN}&account=${process.env.FERED_TRIPOSO_ACCID}`
        };
        request(options, function (error, response) { 
            if (error) reject (new Error(error));
            else resolve(response.body);
        });
    });
}

router.get("/api/getFoodDrink", async function(req, res){
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
    if(cek[0].api_hit > 0){
        //UPDATE API_HIT
        let temp = cek[0].api_hit-1;
        let data = await db.executeQuery(conn,`update user set api_hit=${temp} where email = '${user.email}'`);

        //CALL 3RDAPI
        const country = req.query.country;
        const foodDrink = JSON.parse(await getFoodDrink(country));
        const tempLabel = foodDrink.results[0].label;
        const restaurant = JSON.parse(await getRestaurant(country, tempLabel, 10));

        const cetak = [];
        restaurant.results.forEach(element => {
            cetak.push({
                id: element.id,
                name: element.name
            })
        });
        res.status(200).send({
            Famous: tempLabel,
            Restaurant: cetak
        });
    }
    else res.status(400).send("API HIT HABIS!!!");
});

//=====================================================================================================================

router.get("/api/getDiving", async function(req, res){
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
    if(cek[0].api_hit > 0){
        //UPDATE API_HIT
        let temp = cek[0].api_hit-1;
        let data = await db.executeQuery(conn,`update user set api_hit=${temp} where email = '${user.email}'`);

        //CALL 3RDAPI
        const country = req.query.country;
        const restaurant = JSON.parse(await getRestaurant(country, "diving", 10));
        const cetak = [];
        restaurant.results.forEach(element => {
            cetak.push({
                id: element.id,
                name: element.name
            })
        });
        res.status(200).send({
            Famous: "diving",
            Diving: cetak
        });
    }
    else res.status(400).send("API HIT HABIS!!!");
});

//=====================================================================================================================
//DELETE REVIEW

router.delete("/reviewTour", async function(req, res){
    let token = req.query.token;
    let id_review = req.body.id_review;
    let user;

    if(!token)return res.status(401).send("Token not found");
    try{
        user = jwt.verify(token,"proyek_uas");
    }catch(err){
        return res.status(401).send("Token Invalid");
    }

    const conn = await db.getConnection();
    let cekPremium = await db.executeQuery(conn,`select * from user where tipe_user = 1 and email = '${user.email}'`);
    if(cekPremium.length > 0){
        let cek = await db.executeQuery(conn,`select * from review where id_review = '${id_review}'`);
        if(cek.length > 0){
            if(cek[0].email == user.email){
                let data = await db.executeQuery(conn,`delete from review where id_review = '${id_review}'`);
                return res.status(200).send({
                    "nama_jenis" : cek[0].nama_jenis,
                    "jenis" : cek[0].jenis,
                    "comment" : cek[0].comment,
                    "rating" : cek[0].rating,
                    "message" : "Success Delete Review"
                });
            }
            else return res.status(403).send("NOT YOUR REVIEW!!!!");
        }
        else return res.status(404).send("id_review NOT FOUND");
    }
    else return res.status(403).send("User Not Premium!!!");
});

module.exports = router;
//--------------------------------------------------------------