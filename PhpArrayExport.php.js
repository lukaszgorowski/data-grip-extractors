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
    LBRACKET = '[',
    RBRACKET = ']',
    COMMA = ',',
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

output("<?php", NEWLINE,
    "return ", LBRACKET, NEWLINE);

eachWithIdx(ROWS, function (row, i) {
    output(IDENT, quoted(i), ARROW, LBRACKET, NEWLINE);
    mapEach(COLUMNS, function (col) {
        output(IDENT, IDENT, quoted(col.name()), ARROW, quoted(escape(FORMATTER.format(row, col))), COMMA, NEWLINE);
    });
    output(IDENT, RBRACKET, COMMA, NEWLINE);
});
output(RBRACKET, ";", NEWLINE);