const axios = require("axios");
const FormData = require("form-data");
const Mailer = require("../../mailer/index")
const MasterData = require("../../MasterData")

const DB = new MasterData()
class ENVIA {
    formatDocument(response, res) {
        //response son los datos de vtex
        var paquetes = []
        response.items.map(i => {
            var dimensions = i.additionalInfo.dimension
            var price = i.price.toString();
            var priceReal = `${price.slice(0, -2)}`

            paquetes.push({
                "content": i.name,
                "amount": 1,
                "type": "box",
                "dimensions": {
                    "length": dimensions.length,
                    "width": dimensions.width,
                    "height": dimensions.height
                },
                "weight": dimensions.weight,
                "insurance": 0,
                "declaredValue": parseInt(priceReal),
                "weightUnit": "KG",
                "lengthUnit": "CM"
            })
        })


        var axios = require('axios');
        var data = JSON.stringify({
            "origin": {
                "name": "oscar mx",
                "company": "oskys factory",
                "email": "osgosf8@gmail.com",
                "phone": "8116300800",
                "street": "av vasconcelos",
                "number": "1400",
                "district": "mirasierra",
                "city": "Monterrey",
                "state": "NL",
                "country": "MX",
                "postalCode": "66236",
                "reference": ""
            },
            "destination": {
                "name": response.shippingData.address.receiverName,
                "company": "", // response.logisticsInfo.deliveryCompany
                "email": response.clientProfileData.email,
                "phone": response.clientProfileData.phone,
                "street": response.shippingData.address.street,
                "number": response.shippingData.address.number,
                "district": response.shippingData.address.neighborhood,
                "city": response.shippingData.address.city,
                "state": "MEX",
                "country": "MX",
                "postalCode": response.shippingData.address.postalCode,
                "reference": response.shippingData.address.reference,
            },
            "packages": paquetes,
            "shipment": {
                "carrier": "estafeta",
                "service": "ground",
                "type": 1
            },
            "settings": {
                "printFormat": "PDF",
                "printSize": "STOCK_4X6",
                "comments": "comentarios de el envío"
            }
        });

        var config = {
            method: 'post',
            url: 'https://api-test.envia.com/ship/generate/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 71f1aca390ffd4b3231bc839fbb41f341ad61721589b38295e76db95143c467c'
            },
            data: data
        };

        var orderId = response.orderId;


        axios(config)
            .then(function (respuesta) {

                if (respuesta.data.meta === "error") {
                    res.json({ message: respuesta.data })

                } else {
                    //res.json({message: respuesta.data})
                    //orden, url, traking, paquetera, server, base64
                    var trak = respuesta.data.data[0].trackingNumber
                    console.log("-------------->", respuesta.data)
                    DB.pushOn(orderId,'http://estafeta.com', trak, "Estaffeta", res, '')

                }
            })
            .catch(function (error) {
                res.end(error)
            });

    }


}

module.exports = ENVIA;
