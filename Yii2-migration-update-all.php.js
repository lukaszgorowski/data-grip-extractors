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
    if (typeof x === 'string') {
        x = x.trim();
        if (x === '') {
            return false;
        }
        x = Number(x);
    }

    return typeof x === 'number' && !isNaN(x) && x % 1 === 0;
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

var toReturnString = '';

function addOutpudString() {
    for (var i = 0; i < arguments.length; i++) {
        toReturnString = toReturnString + arguments[i];
    }
}

output("$this->update", LBRACKET, NEWLINE, " ");
if (TABLE == null) output(quoted(MY_TABLE), " ")
else output(quoted(TABLE.getName()));

output(COMMA, NEWLINE, "[");
output(quoted(COLUMNS[0].name()), ARROW);

eachWithIdx(ROWS, function (row, i) {
    addOutpudString(IDENT, "[");
    var collNumber=0;
    mapEach(COLUMNS, function (col) {
        if (collNumber===0) {
            output(quoted(escape(FORMATTER.format(row, col))), COMMA)
            collNumber++;
        } else  {
            addOutpudString(quoted(escape(FORMATTER.format(row, col))), COMMA);
        }
    });
    addOutpudString("]", COMMA, NEWLINE);
});
output("]", COMMA,NEWLINE, "[" ,NEWLINE);
output(toReturnString);
output("]", NEWLINE, RBRACKET, ";");