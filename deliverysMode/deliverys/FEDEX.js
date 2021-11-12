const axios = require("axios");
const FormData = require("form-data");
const pdf = require("base64topdf");
const parseString = require('xml2js').parseString;
const Mailer = require("../../mailer/index");
const MasterData = require("../../MasterData")

const DB = new MasterData()

class SENDFEDEX {

    async formatDocument(response, responseServer) {
        //response son los datos de vtex
        var axios = require('axios');
        var OrdV = response.orderId;

        const promise = new Promise((resolve, reject) => {
            var XML_Comodities = '';
            response.items.map((artics) => {
                XML_Comodities +=
                    '<Commodities>' +
                    '<NumberOfPieces>' + artics.quantity + '</NumberOfPieces>\n' +
                    '<Description>' + artics.name + '</Description>\n' +
                    '<CountryOfManufacture>' + 'MX' + '</CountryOfManufacture>\n' +
                    '<Weight>\n' +
                    '<Units>' + 'LB' + '</Units>\n' +
                    '<Value>' + '1' + '</Value>\n' +
                    '</Weight>\n' +
                    '<Quantity>' + '1' + '</Quantity>\n' +
                    '<QuantityUnits>' + 'UN' + '</QuantityUnits>\n' +
                    '<UnitPrice>\n' +
                    '<Currency>NMP</Currency>\n' +
                    '<Amount>' + artics.price + '</Amount>\n' +
                    '</UnitPrice>\n' +
                    '<CustomsValue>\n' +
                    '<Currency>NMP</Currency>\n' +
                    '<Amount>' + artics.quantity + '</Amount>\n' +
                    '</CustomsValue>\n' +
                    '</Commodities>'
            });
            resolve(XML_Comodities)
        });

        promise
            .then(comodities => {
                var data =
                    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v28="http://fedex.com/ws/ship/v28">
            <soapenv:Header/>
            <soapenv:Body>
                <ProcessShipmentRequest xmlns="http://fedex.com/ws/ship/v28">
                    <WebAuthenticationDetail>
                        <ParentCredential>
                            <Key></Key>
                            <Password></Password>
                        </ParentCredential>
                        <UserCredential>
                            <Key>RdrCFt8NwQuVQaSK</Key>
                            <Password>Bbd1Nb5m4ekatPZiMp9BUEI3Y</Password>
                        </UserCredential>
                    </WebAuthenticationDetail>
                    <ClientDetail>
                        <AccountNumber>510087860</AccountNumber>
                        <MeterNumber>119072943</MeterNumber>
                    </ClientDetail>
                    <TransactionDetail>
                        <CustomerTransactionId>TC001 JAN21 APAC</CustomerTransactionId>
                    </TransactionDetail>
                    <Version>
                        <ServiceId>ship</ServiceId>
                        <Major>28</Major>
                        <Intermediate>0</Intermediate>
                        <Minor>0</Minor>
                    </Version>
                    <RequestedShipment>
                        <ShipTimestamp>2021-10-07T10:00:00</ShipTimestamp>
                        <DropoffType>REGULAR_PICKUP</DropoffType>
                        <ServiceType>INTERNATIONAL_PRIORITY</ServiceType>
                        <PackagingType>YOUR_PACKAGING</PackagingType>
                        <PreferredCurrency>NMP</PreferredCurrency>
                        <Shipper>
                            <Contact>
                                <PersonName>GABRIEL ORTIZ</PersonName>
                                <CompanyName>ENVIOS FEDEX</CompanyName>
                                <PhoneNumber>9992635604</PhoneNumber>
                                <EMailAddress>jose@space.bar</EMailAddress>
                            </Contact>
                            <Address>
                                <StreetLines>TC009 JAN 20 APAC</StreetLines>
                                <StreetLines>IPF - CuPack - CN to US-Return</StreetLines>
                                <City>Memphis</City>
                                <StateOrProvinceCode>TN</StateOrProvinceCode>
                                <PostalCode>38117</PostalCode>
                                <CountryCode>US</CountryCode>
                            </Address>
                        </Shipper>
                        <Recipient>
                            <Contact>
                                <PersonName>`+ response.shippingData.address.receiverName + `</PersonName>
                                <CompanyName>`+ response.shippingData.address.receiverName + `</CompanyName>
                                <PhoneNumber>`+ response.clientProfileData.phone + `</PhoneNumber>
                                <EMailAddress>`+ response.clientProfileData.email + `</EMailAddress>
                            </Contact>
                            <Address>
                                <StreetLines>`+ response.shippingData.address.street + `</StreetLines>
                                <StreetLines>`+ response.shippingData.address.neighborhood + `</StreetLines>
                                <City>`+ response.shippingData.address.city + `</City>
                                <StateOrProvinceCode>MX</StateOrProvinceCode>
                                <PostalCode>`+ response.shippingData.address.postalCode + `</PostalCode>
                                <CountryCode>MX</CountryCode>
                            </Address>
                        </Recipient>
                        <RecipientLocationNumber>123456</RecipientLocationNumber>
                        <ShippingChargesPayment>
                            <PaymentType>SENDER</PaymentType>
                            <Payor>
                                <ResponsibleParty>
                                    <AccountNumber>510087860</AccountNumber>
                                    <Contact>
                                        <ContactId>12345</ContactId>
                                        <PersonName>Dhillon</PersonName>
                                    </Contact>
                                </ResponsibleParty>
                            </Payor>
                        </ShippingChargesPayment>
                        <CustomsClearanceDetail>
                            <DutiesPayment>
                                <PaymentType>SENDER</PaymentType>
                                <Payor>
                                    <ResponsibleParty>
                                        <AccountNumber>510087860</AccountNumber>
                                    </ResponsibleParty>
                                </Payor>
                            </DutiesPayment>
                            <DocumentContent>NON_DOCUMENTS</DocumentContent>
                            <CustomsValue>
                                <Currency>NMP</Currency>
                                <Amount>`+ response.value + `</Amount>
                            </CustomsValue>
                            `+ comodities + `
                        </CustomsClearanceDetail>
                        <LabelSpecification>
                            <LabelFormatType>COMMON2D</LabelFormatType>
                            <ImageType>PNG</ImageType>
                            <LabelStockType>PAPER_8.5X11_TOP_HALF_LABEL</LabelStockType>
                            <LabelPrintingOrientation>TOP_EDGE_OF_TEXT_FIRST</LabelPrintingOrientation>
                        </LabelSpecification>
                        <RateRequestTypes>NONE</RateRequestTypes>
                        <PackageCount>1</PackageCount>
                        <RequestedPackageLineItems>
                        <SequenceNumber>1</SequenceNumber>
                            <InsuredValue>
                                <Currency>NMP</Currency>
                                <Amount>500</Amount>
                            </InsuredValue>
                                <Weight>
                                    <Units>LB</Units>
                                    <Value>5</Value>
                                </Weight>
                                <Dimensions>
                                    <Length>3</Length>
                                    <Width>3</Width>
                                    <Height>3</Height>
                                    <Units>IN</Units>
                                </Dimensions>
                    </RequestedPackageLineItems>
                    </RequestedShipment>
                </ProcessShipmentRequest>
            </soapenv:Body>
        </soapenv:Envelope>`;

                var config = {
                    method: 'post',
                    //url: 'https://wsbeta.fedex.com:443/web-services/track',
                    url: 'https://wsbeta.fedex.com:443/web-services/ship',
                    headers: {
                        'Content-Type': 'application/xml',
                        'Cookie': 'siteDC=edc'
                    },
                    data: data
                };

               axios(config)
                    .then(function (response) {
                        if (response.data.meta === 'error') {
                            responseServer.end("error")
                        } else {
                            parseString(response.data, function (err, result) {
                                var trk = result['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0]['ProcessShipmentReply'][0]['CompletedShipmentDetail'][0]['MasterTrackingId'][0]['TrackingNumber'][0];
                                var img = result['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0]['ProcessShipmentReply'][0]['CompletedShipmentDetail'][0]['CompletedPackageDetails'][0]['Label'][0]['Parts'][0]['Image'][0];
                                var url = "";
                                //responseServer.json({message:response.data});
                                DB.pushOn(OrdV, url , trk, "FEDEX", responseServer, img);
                                //console.log(OrdV,url,trk,"FEDEX",server,img);
                                //console.log(response.data);
                            });
                            
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                    });
            })
            .catch(error => console.error(error));


    }

}

module.exports = SENDFEDEX;