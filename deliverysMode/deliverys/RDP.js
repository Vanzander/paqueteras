const axios = require("axios");
const FormData = require("form-data");
const pdf = require("base64topdf");
const Mailer = require("../../mailer/index")

class RedPack {
  
  formatDocument(response, resServer) {
    let addres = response.shippingData.address;
    var envios = response.items.length;
    var deliverys = response.shippingData.logisticsInfo;
    for (let delivery = 0; delivery < deliverys.length; delivery++) {
      let shipingDelivery = deliverys[delivery].deliveryIds;
      let dimensions =
        response.items[deliverys[delivery].itemIndex].additionalInfo.dimension;
      for (let x = 0; x < shipingDelivery.length; x++) {
        var data = [
          {
            deliveryType: {
              id: 2,
            },
            idClient: "110337",
            origin: {
              city: addres.city,
              company: "EUROCOTTON",
              country: "MEX",
              email: "pruebas@eurocotton.com",
              externalNumber: "00",
              internalNumber: "00",
              name: "EUROCOTTON",
              phones: [
                {
                  areaCode: "00",
                  extension: "00",
                  phone: "string",
                },
              ],
              reference3: ".",
              state: "CIUDAD DE MÉXICO",
              street: "MEX Doctor José María Vertiz 1168 1",
              suburb: "INDEPENDENCIA",
              zipCode: "03630",
            },
            parcels: [
              {
                description: "string",
                high: dimensions.height,
                length: dimensions.length,
                piece: "",
                weigth: dimensions.weigth,
                width: dimensions.width,
              },
            ],
            printType: 0,
            reference2: "",
            serviceType: {
              id: 2,
            },
            shippingType: {
              id: 2,
            },

            target: {
              city: addres.city,
              company: "",
              country: "Mex",
              email: response.clientProfileData.email,
              externalNumber: "",
              internalNumber: "",
              name: `${response.clientProfileData.firstName}  ${response.clientProfileData.lastName}`,
              phones: [
                {
                  areaCode: "",
                  extension: "",
                  phone: response.clientProfileData.phone,
                },
              ],
              reference1: addres.reference,
              state: addres.state,
              street: addres.street,
              suburb: addres.neighborhood,
              zipCode: addres.postalCode,
            },
            trackingNumber: ".",
          },
        ];
        this.createRem(data, resServer);
      }
    }
  }

  createRem(data, resServer) {
    this.token()
      .then((token) => {
        var config = {
          method: "post",
          url: "https://apiqa.redpack.com.mx:5600/redpack/automatic-documentation",
          headers: {
            Authorization: `bearer ${token.access_token}`,
            "Content-Type": "application/json",
          },
          data: JSON.stringify(data),
        };

        axios(config)
          .then((res) => {
            var pdf_g = res.data[0].parcels[0].label;
            var name_g = res.data[0].trackingNumber;
            this.createPdf(pdf_g,name_g);
            /* console.log(res.data[0].parcels[0].label); */
            new Mailer("PDF GENERADO EXITOSAMENTE","Redpack",`https://deliveryspackage.herokuapp.com/routes/Documents/${name_g}`,resServer)
          })
          .catch((err) => {
            resServer.json({"message":"Error"});
          });
      })
      .catch(err => {
        resServer.json({"message":"Error"});
      });
  }

  async token() {
    var data = new FormData();
    data.append("grant_type", "password");
    data.append("username", "AMEJIA");
    data.append("password", "3M#$3qecC0tToNS92");

    var config = {
      method: "post",
      url: "https://api.redpack.com.mx/oauth/token",
      headers: {
        Authorization: "Basic YXBwLXJlZHBhY2std2ViOlIzZFBhY2smMjAyMA==",
        ...data.getHeaders(),
      },
      data: data,
    };

    var token = await axios(config)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        return error;
      });
    return token;
  }

  createPdf(base,name){
    pdf.base64Decode(base, `./routes/Documents/${name}.pdf`);
  }

}

module.exports = RedPack;
