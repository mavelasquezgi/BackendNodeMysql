import path from 'path';
import fs from 'fs';
import mkdirp from "mkdirp";
import config from "../config/config";

export const addPDF = async (products:any): Promise<any> => {
   
    return new Promise(async (resolve, reject) => {
        var fonts = {
            Roboto: {
                normal: `${config.PATH.TEMP}/fonts/Roboto-Regular.ttf`,
                bold: `${config.PATH.TEMP}/fonts/Roboto-Medium.ttf`,
                italics: `${config.PATH.TEMP}/fonts/Roboto-Italic.ttf`,
                bolditalics: `${config.PATH.TEMP}/fonts/Roboto-MediumItalic.ttf`
            }
        };

        let content =[];

        content.push(
        {
            table: {
                widths: [120, 120, 120, 120],

                body: [
                    [{ image: `${config.PATH.TEMP}/logo-un.png`, width: 80, height: 80, alignment: 'center' }, { text: '\nSTORE\n\n' + 'FACULTAD DE ADMINISTRACIÓN\n' + 'UNIVERSIDAD NACIONAL DE COLOMBIA\n' + ' SEDE MANIZALES', colSpan: 2, alignment: 'center', bold: true, fontSize: 10, color: '# 181834', fillColor: '' }, {}, { image: `${config.PATH.TEMP}/logo-un.png`, width: 80, height: 80, alignment: 'center' }]
                ]

                }, layout: 'noBorders'
        },
        '\n',
        {
            style: 'tableExample',
            color: '#333',
            table: {
                widths: [96, 96, 96, 96, 53, 53],

                body: [
                    [{ text: 'INFORMACIÓN PRODUCTOS', fontSize: 11, bold: true, color: '# 181834', fillColor: '#DCDCDC', colSpan: 6, alignment: 'center' }, {}, {}, {}, {}, {}],
                ]
            },
            layout: {
                hLineWidth: function (i: any, node: any) {
                    return (i === 0 || i === node.table.body.length) ? 1 : 1;
                },
                vLineWidth: function (i: any, node: any) {
                    return (i === 0 || i === node.table.widths.length) ? 1 : 1;
                },
                hLineColor: function (i: any, node: any) {
                    return (i === 0 || i === node.table.body.length) ? '#eeeeee' : '#eeeeee';
                },
                vLineColor: function (i: any, node: any) {
                    return (i === 0 || i === node.table.widths.length) ? '#eeeeee' : '#eeeeee';
                },
                paddingLeft: function (i: any, node: any) { return 1; },
                paddingRight: function (i: any, node: any) { return 1; },
                paddingTop: function (i: any, node: any) { return 1; },
                paddingBottom: function (i: any, node: any) { return 1; },
            }
        },
        '\n');

        let matriz = [];
        matriz.push([{ text: `ID DEL PRODUCTO`, style: `tableHeader`, alignment: `center` }, { text: `NOMBRE DEL PRODUCTO`, style: `tableHeader`, alignment: `center` }, { text: `CATEGORIA`, style: `tableHeader`, alignment: `center` }]);
        for (let i = 0; i < products.length; i ++) {
            matriz.push(
                [{ text: `${products[i].prod_id}`, style: `tableHeader1`, alignment: `left`},{ text: `${products[i].prod_name}`, style: `tableHeader1`, alignment: `left` },{ text: `${products[i].prod_category}`, style: `tableHeader1`, alignment: `left` }]
        )
        }
        content.push(
            {
                style: 'tableExample',
                color: '#333',
                table: {
                    widths: [160, 160, 90, 90],

                    body: matriz
                },


                layout: {

                    hLineWidth: function (i: any, node: any) {
                        return (i === 0 || i === node.table.body.length) ? 1 : 1;
                    },
                    vLineWidth: function (i: any, node: any) {
                        return (i === 0 || i === node.table.widths.length) ? 1 : 1;
                    },
                    hLineColor: function (i: any, node: any) {
                        return (i === 0 || i === node.table.body.length) ? '#eeeeee' : '#eeeeee';
                    },
                    vLineColor: function (i: any, node: any) {
                        return (i === 0 || i === node.table.widths.length) ? '#eeeeee' : '#eeeeee';
                    },

                    paddingLeft: function (i: any, node: any) { return 1; },
                    paddingRight: function (i: any, node: any) { return 1; },
                    paddingTop: function (i: any, node: any) { return 1; },
                    paddingBottom: function (i: any, node: any) { return 1; },
                }

            },

            '\n',
        );
        var PdfPrinter = require('pdfmake');
        var printer = new PdfPrinter(fonts);
        var fs = require('fs');

        // todo para agregar la marca de agua 
        var dd = {
            watermark: { text: 'STORE CLASIFICADO', color: 'blue', opacity: 0.04, bold: true, italics: false },
            /*
            footer: function (currentPage: any, pageCount: any) {
                return {
                    margin: [0, 7, 29, 0], columns: [{
                        fontSize: 11, color: 'gray', text: [
                            { text: `Pag. ${currentPage.toString()} de ${pageCount}`, linkToDestination: 'Indice', alignment: 'right' }, []
    
                        ], alignment: 'center'
                    }]
                };
    
            },
            background: [
                { image: pathImagePages, width: 600, height: 850, alignment: 'center' },
            ],*/
            content: content,
            styles: {
                header: {
                    fontSize: 12,
                    bold: true,
                    margin: [0, 0, 0, 20]


                },
                tableExample: {
                    margin: [0, 0, 0, 0]

                },
                tableHeader: {
                    bold: true,
                    fontSize: 10,
                    color: '# 181834',
                    fillColor: '#eeeeee',
                    margin: [0, 2, 0, 2]
                },
                tableHeader1: {
                    bold: true,
                    fontSize: 10,
                    color: '# 080811',
                    margin: [5, 4, 0, 5]
                },
                subheader2: {
                    fontSize: 10,
                    bold: false,
                    margin: [5, 5, 5, 4]


                }
            },
            defaultStyle: {
                // alignment: 'justify'

            }
        }
        var temp123;
        var pdfDoc = printer.createPdfKitDocument(dd);
        const ACTFOLDER = config.PATH.TEMP
        await mkdirp(ACTFOLDER).then(made => console.log(`made directories, starting with ${made}`))
        pdfDoc.pipe(temp123 = fs.createWriteStream(`${config.PATH.PDF}/pdfTry.pdf`));
        pdfDoc.end();
        temp123.on('finish', async function () {
            // do send PDF file 
            try {
                resolve("success");
            } catch (e) {
                console.log(e);
                reject("error");
            }

        });
    });
}