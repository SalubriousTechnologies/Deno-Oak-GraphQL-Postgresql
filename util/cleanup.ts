export function removeLastChar(args: string): string {
  const res = args.split(" "); //split by space
  res.pop(); //remove last element
  return res.join(" ");
}

interface anyObj {
  [key: string]: unknown;
}

export function processData(args: anyObj, type: string): string {
  let setData = "";
  let retstr = "";
  if (type == "edit") {
    Object.keys(args).map((key) =>
      setData += ' "' + key + '"' + "='" + args[key] + "' ,"
    );
    retstr = removeLastChar(setData);
  } else if (type == "add") {
    let col = "";
    let val = "";
    Object.keys(args).map((key) => {
      col += ' "' + key + '" ,';
      val += "'" + args[key] + "' ,";
    });
    col = removeLastChar(col);
    val = removeLastChar(val);

    retstr = " ( " + col + " ) VALUES ( " + val + " )";
  }

  return retstr;
}
