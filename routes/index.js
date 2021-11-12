var express = require("express");
var router = express.Router();
var axios = require("axios");
var FormData = require("form-data");
var paqueteria = require("../deliverysMode/deliveryDeside");

router.get("/cartaporteById", async(req, res, next) => {
  let cartaPorteById = req.query.id;
  var data = new FormData();

  var config = {
    method: "get",
    url: `https://oggimexicoqa.vtexcommercestable.com.br/api/oms/pvt/orders/${cartaPorteById}`,
    headers: {
      //"X-VTEX-API-AppKey": "vtexappkey-eurocotton-PSTXNG",
      //"X-VTEX-API-AppToken":
      //  "CYXDBWUMZYMPNVRYJORWEXGNBBMQUJWTNQFLKBAKRMVDKXCIDEDEALOESJCZJERQBSBXQFOINGFRBDDDYDMPFSTCCATBZABMUFBRWFSYQVQUFWDPGYBFRBKJZZUPLNIM",
      "X-VTEX-API-AppKey":"vtexappkey-oggimexicoqa-VMAZLZ",
      "X-VTEX-API-AppToken":"WCFXUPXSUTZJVYNHWYRZBBULSNCUIZZBAMPUCLFLSTQKZJXYGDCNHKBUHUEHMCJUTYIJJSEKTGGHLKLJPENFXMTQLVNHGYZPKVRBAOPOYRUBDTJXJVRIOEWHFSXNEXEU",
      "Content-Type": "application/json",
      Cookie: "janus_sid=d0423c81-9459-4e1f-98ef-9ab57253e2a3",
      ...data.getHeaders(),
    },
    data: data,
  };

  var getShipVtexById = await axios(config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });

  paqueteria(getShipVtexById, req, res);
});


router.get("/getPdf", async(req, res, next) => {
  let name = req.query.id;
  const file = `${__dirname}/Documents/${name}.pdf`;
  res.download(file); // Set disposition and send it.
})

module.exports = router;
