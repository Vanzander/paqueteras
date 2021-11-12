const axios = require("axios");
const FormData = require("form-data");
const Mailer = require("../../mailer/index")

class ODM {
  formatDocument(response, res) {
    var deliverys = response.shippingData.logisticsInfo;
    for (let delivery = 0; delivery < deliverys.length; delivery++) {
      let shipingDelivery = deliverys[delivery].deliveryIds;
      let dimensions =
        response.items[deliverys[delivery].itemIndex].additionalInfo.dimension;
      for (let x = 0; x < shipingDelivery.length; x++) {
        var data = JSON.stringify({
          usuario: "amecotweb",
          password: "cotton2021",
          nombreorigen: "Eurocotton",
          rfcorigen: "DAOM801128JCP",
          direccionorigen:
            "CIUDAD DE MÉXICO MEX Doctor José María Vertiz 1168 1",
          coloniaorigen: "INDEPENDENCIA",
          cporigen: "03630",
          correoorigen: "pruebas@eurocotton.com",
          telefonoorigen: "525543774538",
          nombredestino: response.shippingData.address.receiverName,
          rfcdestino: "Nodeclarado",
          direcciondestino: `${response.shippingData.address.city} ${response.shippingData.address.state} ${response.shippingData.address.country}`,
          coloniadestino: response.shippingData.address.neighborhood,
          cpdestino: response.shippingData.address.postalCode,
          correodestino: "Nodeclarado",
          telefonodestino: response.clientProfileData.phone,
          tipoentrega: 1,
          tipoenvio: "S",
          envios: 1,
          numeropedido: response.orderId,
          referencia: "",
          codigomercancia:
            response.items[deliverys[delivery].itemIndex].productId,
          largo: dimensions.length,
          alto: dimensions.height,
          ancho: dimensions.width,
          peso: dimensions.weight,
          valordeclarado: response.totals[0].value,
        });
        this.createRem(data, res);
      }
    }
  }

  createRem(data, resServer) {
    var config = {
      method: 'post',
      url: 'https://webservice.odmexpress.com.mx/odmexpress/Remesa',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    axios(config)
      .then(function (res) {
        if (!res.data.error) {
         new Mailer("PDF GENERADO EXITOSAMENTE","ODM",res.data.urlCartaPorte,resServer)
        } else {
          resServer.json({"message": res.data.error})
        }
      })
      .catch(function (error) {
        /* ¿Qué ocurre si el servidor deODM no responde? */
        resServer.json({"message": error})
        
      });
  }
}

module.exports = ODM;
