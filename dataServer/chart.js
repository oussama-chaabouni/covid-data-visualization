
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


const chart=function()  {
    /*
    GLOBAL.document = new JSDOM(html).window.document;

    var selectList =GLOBAL.document.createElement("select");
    selectList.id = "mySelect";
    return myParent.appendChild(selectList);
*/

    const dom = new JSDOM(`<body>

      <script>   
                   
                   var selectList =document.createElement("select");
                 selectList.setAttribute("id","mySelect") 
                  document.body.appendChild(selectList);
                  
     </script>
</body>`, { runScripts: "dangerously" });

    dom.window.document.body.children.length === 2;
}
module.exports=chart
