const express = require("express");

const router = express.Router();
router.use(express.urlencoded({extended:true}));

function getRestaurant(country, label, jumlah){
    return new Promise(function(resolve, reject){
        var request = require('request');
        var options = {
            'method': 'GET',
            'url': `https://www.triposo.com/api/20200405/poi.json?tag_labels=${label}&location_id=${country}&count=${jumlah}&order_by=-score&fields=name,id&token=owymkzfrhejlzq2psl0k0otvyvrczhyi&account=LNPHPM5C`
        };
        request(options, function (error, response) { 
            if (error) reject (new Error(error));
            else resolve(response.body);
        });
    });
}

router.get("/api/getRestaurant/:country/:jumlah", async function(req, res){
    //const country = JSON.parse(await getCountry(req.query.title));
    if(req.params.country=="kosong"){
        res.status(400).send({"msg" : "Restaurant dengan negara kosong tidak ditemukan :("});
    }
    else if(req.params.jumlah=="0"){
        return res.status(404)
        .send({"msg":`Tidak akan keluar response kalau jumlah 0`});
    }
    else {
        // const restaurant = JSON.parse(await getRestaurant(req.query.country, req.query.label, req.query.jumlah));

        // const cetak = [];
        // restaurant.results.forEach(element => {
        //     cetak.push({
        //         id: element.id,
        //         name: element.name
        //     })
        // });
        // res.status(200).send(cetak);
        res.status(200).send({
            "id": "N__429735547",
            "name": "Clärchens Ballhaus"
        });
    }
});


//===========================================================================================================================


function getSimilarPlace(country, jumlah){
    return new Promise(function(resolve, reject){
        var request = require('request');
        var options = {
            'method': 'GET',
            'url': `https://www.triposo.com/api/20200405/poi.json?location_id=${country}&count=${jumlah}&annotate=similarity:T__389cda256332&order_by=-similarity&fields=name,id&token=owymkzfrhejlzq2psl0k0otvyvrczhyi&account=LNPHPM5C`
        };
        request(options, function (error, response) { 
            if (error) reject (new Error(error));
            else resolve(response.body);
        });
    });
}

router.get("/api/getSimilarPlace/:country/:jumlah", async function(req, res){
    if(req.params.country=="kosong"){
        res.status(400).send({"msg" : "Tempat dengan negara kosong tidak ditemukan :("});
    }
    else if(req.params.jumlah=="0"){
        return res.status(404)
        .send({"msg":`Tidak akan keluar response kalau jumlah 0`});
    }
    else {
        // const restaurant = JSON.parse(await getSimilarPlace(req.params.country, req.params.jumlah));

        // const cetak = [];
        // restaurant.results.forEach(element => {
        //     cetak.push({
        //         id: element.id,
        //         name: element.name
        //     })
        // });
        // res.status(200).send(cetak);

        res.status(200).send({
            "id": "T__b98be764da47",
            "name": "Ramen-Ya"
        });
    }
});

//=====================================================================================================================


function getFoodDrink(country){
    return new Promise(function(resolve, reject){
        var request = require('request');
        var options = {
            'method': 'GET',
            'url': `https://www.triposo.com/api/20200405/tag.json?location_id=${country}&ancestor_label=cuisine&order_by=-score&fields=name,label&token=owymkzfrhejlzq2psl0k0otvyvrczhyi&account=LNPHPM5C`
        };
        request(options, function (error, response) { 
            if (error) reject (new Error(error));
            else resolve(response.body);
        });
    });
}

router.get("/api/getFoodDrink", async function(req, res){
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
});

//=====================================================================================================================

router.get("/api/getDiving", async function(req, res){
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
});

module.exports = router;
//--------------------------------------------------------------