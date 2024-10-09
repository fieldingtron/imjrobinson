window.addEventListener('load', (event) => {
  console.log('page is fully loaded');
  const subcats = getSubCategories("paintings")
  
  //test for product List 
  const productz = document.getElementById("productz")
  if (productz) {
      listProductz()
  }

});

const storeID = 1982416788

async function listProductz() {
    // console.log("will be listing products here")
    const queryString = window.location.search;
    // console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
    const prodcat = urlParams.get('prodcat')
    console.log(prodcat);
    getProductsInCategory(prodcat, storeID)
    
}

async function getSubCategories(categoryz) {
    let categories = await fetch('https://api.reflowhq.com/v1/stores/'+ storeID + '/categories').then(r => r.json());
    const cat = categories.find(category=>category.name===categoryz)
    const subcats = cat.subcategories
    //console.log(subcats)
    listCategories(subcats,"divz")   
}

function capitalizeWords(string) {
    return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

function imagifyWord(string) {
    return string.toLowerCase().replaceAll(" ","-")    
}

async function getProductsInCategory(catzz,storeID) {
   // Print all the products from a category
    let products = await fetch('https://api.reflowhq.com/v1/stores/'+ storeID + '/products/?category='+ catzz).then(r => r.json());
    console.log(products.data); 
}



function listCategories(cats,whatDiv){
    const divz = document.getElementById(whatDiv)
    
    if (!divz)
        return
    //for each category get capitliazed title and image
    
    cats.forEach(category=> {
        // heading
        divz.innerHTML += "<h4 class='text-center my-3'>" + capitalizeWords(category.name) + "</h4>"
        // let imgname = '/assembalages.png'
        let imgname = imagifyWord(category.name)
        imgname = `/assets/img/${imgname}`
        getProductsInCategory(category.id, storeID)
        // image
        // console.log(category)
        divz.innerHTML += "<a href='/productz.html?prodcat=" + category.id + "'><img src=\'" + imgname + ".png\' class='subcats'></a>"
    })
}