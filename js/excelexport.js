
function Exportar()
{
    if (navigator.appName == "Microsoft Internet Explorer") {
        var oWin = window.open();
        oWin.document.write('sep=;\r\n' + CSV);
        oWin.document.close();
        oWin.document.execCommand('SaveAs', true, fileName + ".csv");
        oWin.close();
    }

    var textRange;
    var j = 0;
    var tab = document.getElementById(".table-import"); // id da tabela
    if (document.getElementById(".table-import").rows.length < 2) {
        alert("Por favor, realizar uma pesquisa antes de exportar.");
    } else {
        var a = [], csv = '', LF = '\r\n', r, c, rs, cs, row, cell, i, j, v;

        for (r = 0; r < tab.rows.length; r++) {
            row = tab.rows[r];

            for (c = 0; c < row.cells.length; c++) {
                cell = row.cells[c];
                rs = cell.rowSpan + r;
                cs = cell.colSpan + c;

                for (i = r; i < rs; i++) {
                    if (!a[i]) {
                        a[i] = [];
                    }

                    for (j = c; j < cs; j++) {
                        a[i].push(i > r || j > c ? '' : cell.innerHTML);
                    }
                }
            }
        }



        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // Se for Internet Explorer
        {
            for (r = 0; r < a.length; r++) {
                v = '';
                for (c = 0; c < a[r].length; c++) {
                    csv += (v + a[r][c]);
                    v = ';';
                }
                csv += '\r\n';
            }

            txtArea1.document.open("txt/html", "replace");
            txtArea1.document.write(csv);
            txtArea1.document.close();
            txtArea1.focus();
            sa = txtArea1.document.execCommand("SaveAs", true, "Socilitações.csv");

        } else
            for (r = 0; r < a.length; r++) {
                v = '';
                for (c = 0; c < a[r].length; c++) {
                    csv += (v + a[r][c]);
                    v = ';';
                }
                csv += "%0A";
            }

        var a = document.createElement('a');
        a.href = 'data:attachment/csv,' + csv;
        a.target = '_blank';
        a.download = 'Solicitações.csv';

        document.body.appendChild(a);
        a.click();
        //sa = window.open('data:attachment/csv,' + encodeURIComponent(csv));  

        return (sa);
    }
}
