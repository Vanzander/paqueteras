const axios = require("axios");

class MasterData {
    async pushOn(orden, url, traking, paquetera, server, base64) {
        var data = JSON.stringify({
            "orden": orden,
            "url": url,
            "tracking": traking,
            "paquetera": paquetera,
            "base64": base64
        });

        var config = {
            method: 'post',
            url: 'https://oggimexicoqa.vtexcommercestable.com.br/api/dataentities/PQ/documents/',
            headers: {
                'Content-Type': 'application/json',
                'X-VTEX-API-AppKey': 'vtexappkey-oggimexicoqa-VMAZLZ',
                'X-VTEX-API-AppToken': 'WCFXUPXSUTZJVYNHWYRZBBULSNCUIZZBAMPUCLFLSTQKZJXYGDCNHKBUHUEHMCJUTYIJJSEKTGGHLKLJPENFXMTQLVNHGYZPKVRBAOPOYRUBDTJXJVRIOEWHFSXNEXEU',
                'Cookie': 'janus_sid=72463fd5-e331-4c83-bd2e-8d221a611d35'
            },
            data: data
        };

        let responseMaster = await axios(config)
            .then(function (response) {
                return response
                //console.log(server);
            })
            .catch(function (error) {
                return error
            });
            
        server.json({ message: responseMaster.data })
    }


}

module.exports = MasterData;