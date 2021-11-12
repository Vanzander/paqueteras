const axios = require("axios");
const { parseString } = require("xml2js");
const Mailer = require("../../mailer/index")
class PaqueteExpress {
   
  constructor(){
   this.path = "http://cc.paquetexpress.com.mx/RadRestFul/api/rad"; //path de la api
   this.path_pdf =
    "http://qaglp.paquetexpress.mx:8083/wsReportPaquetexpress/GenCartaPorte?trackingNoGen="; //path de donde se guardan los pdf
  }

  formatDocument(response,resServer) {
    
    var perfil =  response.clientProfileData
    var direccion = response.shippingData.address
    var items = response.items;
    var itemsAll = []
    items.forEach((item) => {
      itemsAll.push({
        srvcId: "PACKETS",
        weight: `${item.additionalInfo.dimension.weight}`,
        
        volL: `${item.additionalInfo.dimension.length}`,
        volW: `${item.additionalInfo.dimension.width}`, 
        volH: `${item.additionalInfo.dimension.height}`,
        cont: item.name,
        qunt: "1",
      });
    })
    console.log("itemms_all",itemsAll)

    
    this.token().then(token => {
      var data = {
        header: {
          security: {
            user: "WSACOTTON",
            type: 0,
            token: token,
          },
        },
        body: {
          request: {
            data: [
              {
                billRad: "REQUEST",
                billClntId: "5318520",
                pymtMode: "PAID",
                pymtType: "C",
                comt: "Para Euroctton",
                radGuiaAddrDTOList: [
                  {
                    addrLin1: "CIUDAD DE MÉXICO",
                    addrLin3: "MEX ",
                    addrLin4: "Doctor José María Vertiz 1168 1",
                    addrLin5: "INDEPENDENCIA",
                    addrLin6: "--",
                    strtName: "--",
                    drnr: "144",
                    phno1: "11569900",
                    zipCode: "03630",
                    clntName: "Eurocotton",
                    email: "pruebas@eurocotton.com",
                    contacto: "Adrian Mejia",
                    addrType: "ORIGIN",
                  },
                  {
                    addrLin1: direccion.city,
                    addrLin3: direccion.state,
                    addrLin4: direccion.country,
                    addrLin5: direccion.street,
                    addrLin6: direccion.number,
                    strtName: direccion.neighborhood,
                    drnr: "--",
                    phno1: perfil.phone,
                    zipCode: direccion.postalCode,
                    clntName: perfil.firstName + " " + perfil.lastName,
                    email: perfil.email,
                    contacto: perfil.firstName + " " + perfil.lastName,
                    addrType: "DESTINATION",
                  },
                ],
                radSrvcItemDTOList: itemsAll,
                listSrvcItemDTO: [
                  {
                    srvcId: "EAD",
                    value1: "",
                  },
                  {
                    srvcId: "RAD",
                    value1: "",
                  },
                ],
                typeSrvcId: "STD-T",
                listRefs: [
                  {
                    grGuiaRefr: "ARPEG562",
                  },
                ],
              },
            ],
            objectDTO: null,
          },
          response: null,
        },
      };

      let config = {
        method: "post",
        url: `${this.path}/v1/guia`,
        data: data,
      };

      axios(config)
          .then((res) => {
            var pdfArray = ""
           if(res.data.body.response.success){
              pdfArray = res.data.body.response.data;
              console.log(res.data.body.response.data)
           }else{
             console.log(res.data.body.response.messages)
           }
            new Mailer("PDF GENERADO EXITOSAMENTE","paquetexpress",`https://cc.paquetexpress.com.mx:8082/wsReportPaquetexpress/GenCartaPorte?trackingNoGen=${pdfArray}`,resServer)
          })
          .catch((e) => {
            console.log(e)
            resServer.json({"message":"error1"})
          });
    }).catch(e => {
      console.log(e)
      resServer.json({"message":"error2"})
    });

  }

  async token() {
    var data = JSON.stringify({
      header: { security: { user: "WSACOTTON", password: "NTMxODUyMA" } },
    });

    var config = {
      method: "post",
      url: "http://cc.paquetexpress.com.mx/RadRestFul/api/rad/loginv1/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    var token = await axios(config)
      .then(function (response) {
        return response.data.body.response.data.token;
      })
      .catch(function (error) {
        return "error";
      });

    return token;
  }
}

module.exports = PaqueteExpress;
