class Printer {

  print(id) {
    let content = document.getElementById(id);
    let pri = document.getElementById("ifmcontentstoprint").contentWindow;
    pri.document.open();

    // body
    pri.document.write(content.innerHTML);

    let body = pri.document.getElementsByTagName("body")[0]
    body.setAttribute("class", "printer-body")
    
    // head
    let head = pri.document.getElementsByTagName("head")[0]
    let css = document.createElement("link")
    css.setAttribute("rel", "stylesheet")
    css.setAttribute("href", "/print.css")
    css.setAttribute("type", "text/css")
    head.appendChild(css)

    pri.document.close();

    pri.focus();
    setTimeout(() => {
      pri.print();
    },1000)
  }

}

export default new Printer()