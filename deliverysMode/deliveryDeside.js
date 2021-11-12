const ODM = require("./deliverys/ODM");
const RDP = require("./deliverys/RDP");
const PKE = require("./deliverys/PKE");
const DHL = require("./deliverys/DHL");
const ENV = require("./deliverys/ENVIACOM");
const FED = require("./deliverys/FEDEX");
/* new Mailer("PDF GENERADO EXITOSAMENTE","ODM",res.data.urlCartaPorte,resServer) */
module.exports = paqueteras = (pack, req, res) => {
  const deliverys = {
    ["Estafeta"]: (data) => {
      var document_odm = new ENV();
      document_odm.formatDocument(data, res);
    },
    ["Fedex"]: (data) => {
      var document_odm = new FED(); 
      document_odm.formatDocument(data, res);
    }
  };
  pack.shippingData.logisticsInfo.map((vtexInfo) => {
    vtexInfo.deliveryIds.map((delivery) => {
      let deliveryId = delivery.courierName;
      if (typeof deliverys[deliveryId] == "function") {
        deliverys[deliveryId](pack);
      } else {
        res.json({ "message": `No hay metodo para ${deliveryId}` });
      }
    });
  });
};
