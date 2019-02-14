$(document).ready(function () {
    $('.table-import').DataTable({
        dom: 'Bfrtip',
        responsive: true,
        "lengthMenu": [[20, 10, 15, 25, 50, -1], [20, 10, 15, 25, 50, 'Tudo']],
        pageLength: 10,
        "columnDefs": [{"targets": 2, "orderable": false}],
        "language": {
            "url": "json/datatables-Portuguese-Brasil.json"
        },

        buttons: [
            'pageLength', 'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    });
});

$('#form-import').on('submit', function (e) {
    e.preventDefault();
    $('#progresso').text('0%').attr('aria-valuenow', 0).css('width', '0');
    var file = $("#arquivo")[0].files[0];

    var t = $('#export').DataTable();
    var counter = 1;

    var reader = new FileReader();
    reader.onload = function (progressEvent) {
        // By lines
        var l = this.result.split('\n');
        for (var ln = 0; ln < l.length; ln++) {
            (function () {
                var ean_txt = l[ln];
                var url = "participantes.xlsx";
                var oReq = new XMLHttpRequest();
                oReq.open("GET", url, true);
                oReq.responseType = "arraybuffer";
                oReq.onload = function (e) {
                    var arraybuffer = oReq.response;
                    /* convert data to binary string */
                    var data = new Uint8Array(arraybuffer);
                    var arr = new Array();
                    for (var i = 0; i != data.length; ++i)
                        arr[i] = String.fromCharCode(data[i]);
                    var bstr = arr.join("");
                    /* Call XLSX */
                    var workbook = XLSX.read(bstr, {type: "binary"});
                    /* DO SOMETHING WITH workbook HERE */
                    var first_sheet_name = workbook.SheetNames[0];
                    /* Get worksheet */
                    var worksheet = workbook.Sheets[first_sheet_name];
                    var lines = XLSX.utils.sheet_to_json(worksheet, {raw: true});
                    //console.log(lines);
                    //fazer o for no txt e verificar se encontra o ean
                    for (var line = 0; line < lines.length; line++) {
                        (function (index) {
                            i++;
                            var cd_ean = lines[index]['Nº do código de barras'];
                            if (cd_ean == ean_txt) {
                                var porcentagem = i * 100 / lines.length;
                                $('#progresso').attr('aria-valuenow', porcentagem).css('width', porcentagem + '%');
                                t.row.add([
                                    '<td>' + (lines[index]['Nº do pedido'] ? lines[index]['Nº do pedido'] : "") + '</td>',
                                    '<td>' + (lines[index]['Nome'] ? lines[index]['Nome'] : "") + '</td>',
                                    '<td>' + (lines[index]['Sobrenome'] ? lines[index]['Sobrenome'] : "") + '</td>',
                                    '<td>' + (lines[index]['Email'] ? lines[index]['Email'] : "") + '</td>',
                                    '<td>' + (lines[index]['Nº do código de barras'] ? lines[index]['Nº do código de barras'] : "") + '</td>',
                                    '<td>' + (lines[index]['Celular'] ? lines[index]['Celular'] : "") + '</td>',
                                    '<td>' + (lines[index]['Sexo'] ? lines[index]['Sexo'] : "") + '</td>',
                                    '<td>' + (lines[index]['Idade'] ? lines[index]['Idade'] : "") + '</td>',
                                    '<td>' + (lines[index]['Já fechou seu intercâmbio?'] ? lines[index]['Já fechou seu intercâmbio?'] : "") + '</td>',
                                    '<td>' + (lines[index]['Qual sua expectativa para o E-DublinXP?'] ? lines[index]['Qual sua expectativa para o E-DublinXP?'] : "") + '</td>'

                                ]).draw(false);
                                counter++;
                            }
                        })(line);
                    }
                }
                oReq.send();
            })(ln);
        }
        $("#report-import").find('table tbody tr:last-child').remove();
        $('#modal-spinner').modal('hide');
    };
    reader.readAsText(file);
});


/* set up XMLHttpRequest */




