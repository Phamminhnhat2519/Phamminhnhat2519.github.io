const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: "jyr0c09mevll",
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: "6-F-Mz8peqPUBeQJGt2EfBWvBSuWSDNLIFSubM-bnEU"
});


var cart = [];
var buttonDOM = [];
var listIconDiv = document.querySelector('.list-icon-div');
var btnStoreDiv = document.querySelector('.btn-store-div');
var numberProCartPlus = document.querySelector('.number-products-cart-plus');
var productItems = document.querySelector('.product-items');
var cartOverLay = document.querySelector('.cart-overlay');
var closeBtn = document.querySelector('.close');
var listSelectedPros = document.querySelector('.list-selected-products');
var chevronUp = document.querySelector('.fa-chevron-up');
var chevronDown = document.querySelector('.fa-chevron-down');
var amountSelected = document.querySelector('.amount-selected-pro');
var totalOverlay = document.querySelector('.total-overlay-cart');
var clearAll = document.querySelector('.clear-all');
var purchaseAll = document.querySelector('.purchase-all');

closeBtn.addEventListener("click", () => {
    cartOverLay.style.transform = "translateX(101%)";
});

btnStoreDiv.addEventListener("click", () => {
    cartOverLay.style.transform = "translateX(0%)";
})
class Products {
    async getProducts() {
        try {
            let contentful = await client.getEntries({
                content_type: "comfyHouseProducts"
            });

            // let result = await fetch('../packageJson/products.json');
            // let data = await result.json();
            // let products = data.items;

            let products = contentful.items;
            products = products.map(product => {
                let { title, price } = product.fields;
                let { id } = product.sys;
                let url = product.fields.image.fields.file.url;
                return { title, price, id, url }
            })
            return products;
        } catch (error) {
            console.log("Error: " + error);

        }
    }
}

class UI {
    displayProducts(products) {
        let str = '';
        products.forEach(product => {
            str +=
                '<article class="product-item">'
                + '<div class="bag-btn" data-id="' + product.id + '">'
                + 'add in cart'
                + '</div>'
                + '<img src="' + product.url + '" alt="">'
                + '<div class="detail-item">'
                + '<p class="title-item">' + product.title + '</p>'
                + '<p class="price-item">$' + product.price + '</p>'
                + '</div>'
                + '</article>'
        })
        productItems.innerHTML = str;
        this.setNumberShow();
        cart = JSON.parse(localStorage.getItem("carts"));
        this.displayOnOverLay(cart);
    }

    logicFunction() {
        this.addToCart();
        this.setNumberShow();
        this.allFunctionOverLay();
        this.clearAllFunction();
    }

    clearAllFunction() {
        clearAll.addEventListener("click", () => {
            var select = alert('All Products Removed!');

            cart = [];
            Storage.saveCart(cart);
            this.displayOnOverLay(cart);
            this.setNumberShow();

        })
    }
    allFunctionOverLay() {
        cartOverLay.addEventListener("click", event => {
            if (event.target.classList.contains('remove-btn-pro')) {
                let id = event.target.dataset.id;
                cart = cart.filter(item => item.id !== id);
                Storage.saveCart(cart);
                this.displayOnOverLay(Storage.getCart());
                this.setNumOnNav();
                this.setAllTotal();
            } else if (event.target.classList.contains("fa-chevron-up")) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                var item = cart.find(pro => pro.id === id);
                item.amount = item.amount + 1;
                numberProCartPlus.innerHTML = item.amount;
                Storage.saveCart(cart);
                this.setNumberShow();
                this.displayOnOverLay(cart);
            } else if (event.target.classList.contains('fa-chevron-down')) {
                let subAmount = event.target;
                let id = subAmount.dataset.id;
                var item = cart.find(pro => pro.id === id);
                item.amount = item.amount - 1;
                if (item.amount <= 1) {
                    item.amount = 1;
                }
                numberProCartPlus.innerHTML = item.amount;
                Storage.saveCart(cart);
                this.setAllTotal();
                this.setNumOnNav();
                this.displayOnOverLay(cart);
            }
        });
    }

    removePro() {
        var removePro = document.querySelectorAll('.remove-btn-pro');
        removePro.forEach(btn => {
            btn.addEventListener('click', event => {
                var item = event.target;
                alert("hi");
                var id = item.dataset.id;
                cart = cart.filter(product => product.id !== id);
                Storage.saveCart(cart);
            })
        })
    }

    setNumberShow() {
        this.setNumOnNav();
        this.setAllTotal();
    }

    setNumOnNav() {
        let sum = 0;
        var products = JSON.parse(localStorage.getItem("carts"));
        if (products != null) {
            products.forEach(product => {
                sum += product.amount;
            })
            numberProCartPlus.innerHTML = sum;
        }
    }

    setAllTotal() {
        let sum = 0;
        var products = Storage.getCart();
        products.forEach(pro => {
            sum += pro.price * pro.amount;
        })
        sum = sum.toFixed(2);
        totalOverlay.innerHTML = sum;
    }


    addToCart() {
        var bagBtn = [...document.querySelectorAll('.bag-btn')];
        buttonDOM = bagBtn;
        bagBtn.forEach(btn => {
            let id = btn.dataset.id;
            let isInCart = cart.find(item => {
                item.id === id;
            })
            if (isInCart) {
                btn.innerHTML = "In Cart";
                btn.disabled = true;
            } else {
                btn.addEventListener("click", event => {
                    btn.innerHTML = "In Cart";
                    btn.disabled = true;
                    let item = event.target;
                    let id = item.dataset.id;
                    var checkInCart = cart.find(item => item.id === id);
                    if (checkInCart) {
                        checkInCart.amount += 1;
                        Storage.saveCart(cart);
                        this.displayOnOverLay(cart);
                        this.setNumberShow();
                    } else {
                        let gotItem = { ...Storage.getProduct(id), amount: 1 };
                        cart = [...cart, gotItem];
                        Storage.saveCart(cart);
                        this.displayOnOverLay(JSON.parse(localStorage.getItem("carts")));
                        cartOverLay.style.transform = "translateX(0%)";
                        this.setNumberShow();
                    }
                })
            }
        })
    }

    displayOnOverLay(cart) {
        let str = '';
        if (cart != null) {
            cart.forEach(item => {
                str +=
                    '<article class="selected-product">'
                    + '<img src="' + item.url + '" alt="">'
                    + '<div class="more-details-product">'
                    + '<p class="name-selected-pro">' + item.title + '</p>'
                    + '<p class="price-selected-pro">$' + item.price + '</p>'
                    + '<p class="remove-btn-pro" data-id = "' + item.id + '">remove</p>'
                    + '</div>'
                    + '<div class="functions-selected-pro">'
                    + '<i class="fa fa-chevron-up" data-id = "' + item.id + '"></i>'
                    + '<h6 class="amount-selected-pro">' + item.amount + '</h6>'
                    + '<i class="fa fa-chevron-down" data-id = "' + item.id + '"></i>'
                    + '</div>'
                    + '</article>'
            });
            listSelectedPros.innerHTML = str;
        }
        else {
            cart = [];
        }
    }
}


class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem("carts", JSON.stringify(cart));
    }
    static getCart() {
        let products = JSON.parse(localStorage.getItem("carts"));
        if (products != null) {
            return products;
        }
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    var products = new Products();
    var ui = new UI();
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
        ui.logicFunction();
    })
})