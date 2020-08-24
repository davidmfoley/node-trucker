export default function getLineEdits(requires) {
  var byLine = {};
  requires.forEach(function(r) {
    var line = r.loc.line;
    byLine[line] = byLine[line] || [];
    byLine[line].push(r);
    byLine[line] = byLine[line].sort(function(a,b){
      return a.loc.start > b.loc.start;
    });
  });
  return byLine;
};
