function eachWithIdx(iterable, f) {
    var i = iterable.iterator();
    var idx = 0;
    while (i.hasNext()) f(i.next(), idx++);
}

function mapEach(iterable, f) {
    var vs = [];
    eachWithIdx(iterable, function (i) {
        vs.push(f(i));
    });
    return vs;
}

function escape(str) {
    str = str.replace("/\t|\b|\\f/g", "");
    str = com.intellij.openapi.util.text.StringUtil.escapeXml(str);
    str = str.replaceAll("\\r|\\n|\\r\\n", "<br/>");
    return str;
}

var NEWLINE = "\n",
    ARROW = " => ",
    QUOTE = "'",
    IDENT = '    ',
    LBRACKET = '(',
    RBRACKET = ')',
    COMMA = ',',
    MY_TABLE='MY_TABLE',
    NOQUOTED = ['NULL', 'TRUE', 'FALSE', 'null', 'true', 'false'];


function isInteger(x) {
    return x % 1 === 0;
}

function quoted(val) {
    if (NOQUOTED.indexOf(val) !== -1) {
        return val;
    }
    if (isInteger(val)) {
        return val;
    }
    return QUOTE + val + QUOTE;
}

function output() {
    for (var i = 0; i < arguments.length; i++) {
        OUT.append(arguments[i]);
    }
}

eachWithIdx(ROWS, function (row, i) {
    output(IDENT, "$this->update", LBRACKET);
    if (TABLE == null) output(quoted(MY_TABLE))
    else output(NEWLINE,IDENT, IDENT, quoted(TABLE.getName()));

output(COMMA, NEWLINE, IDENT, IDENT, " [");
    var i = 0;
    mapEach(COLUMNS, function (col) {
        if (i === 0) {
            i++;
        } else {
            output(IDENT, IDENT, IDENT, quoted(col.name()), ARROW, quoted(escape(FORMATTER.format(row, col))), COMMA, NEWLINE);
        }
    });
    output("]");

    output(COMMA, NEWLINE, IDENT, IDENT, " [");
    output(quoted(COLUMNS[0].name()), ARROW, quoted(escape(FORMATTER.format(row, COLUMNS[0]))));
    output(COMMA, "]", NEWLINE, RBRACKET, ";", NEWLINE);

});

output(NEWLINE);