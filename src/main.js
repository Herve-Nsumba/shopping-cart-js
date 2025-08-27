//Get the "shop" div from HTML where all products will be displayed
let shop = document.getElementById("shop");

//The current cart state
//Try to get saved cart from the localStorage, otherwise use empty array
let basket = JSON.parse(localStorage.getItem("data")) || [];

//Function to generate the shop UI dynamically from shopItemsData
let generateShop = () => {
  return (shop.innerHTML = shopItemsData
    .map((x) => {
      //Done to avoid the getting of each key as x.id or same format just to use their names only
      let { id, name, price, desc, img } = x;
      //This is done for the local storage to see if the product already exists in the basket get the number and store it here else give empty array
      let search = basket.find((x) => x.id === id) || [];
      //Return HTML string for each product
      return `
  <div id= product-id${id} class="item">
        <img width="220" src="${img}" alt="" />
        <div class="details">
          <h3>${name}</h3>
          <p>${desc}</p>
          <div class="price-quantity">
            <h2>$ ${price}</h2>
            <div class="buttons">
              <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
              <div id=${id} class="quantity"> 
              ${search.item === undefined ? 0 : search.item}</div>
              <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
            </div>
          </div>
        </div>
      </div>
  `; //After the search in the local storage is done (line 46) you see if the search.item is undefined to return 0 else return the search.item (line 59)
    })
    .join("")); //Join all product HTML strings into one big string
};
generateShop();
//Function to handle incrementing item quantity
let increment = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id); //Check if this item is already in the basket

  if (search === undefined) {
    basket.push({
      id: selectedItem.id,
      item: 1,
    });
  } else {
    search.item += 1;
  }

  //Update the UI with the new value
  update(selectedItem.id);
  localStorage.setItem("data", JSON.stringify(basket));
};
//Function to handle decrementing item quantity
let decrement = (id) => {
  let selectedItem = id;
  //First find this item in the basket
  let search = basket.find((x) => x.id === selectedItem.id);
  //If not found,do nothing
  if (search === undefined) return;
  //If quantity is 0, do nothing
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }
  update(selectedItem.id);
  //Remove the item from basket completely if quantity becomes 0(remember the basket is cart state and is seen only in the localStorage)
  basket = basket.filter((x) => x.item !== 0);

  localStorage.setItem("data", JSON.stringify(basket));
};
//Function to update quantity on Ui
let update = (id) => {
  let search = basket.find((x) => x.id === id);

  document.getElementById(id).innerHTML = search.item;
  calculation();
};
//Function to calculate and show total items in cart
let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};
calculation();
