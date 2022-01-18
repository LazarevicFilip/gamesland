window.onload = function(){
    //f-je za sve stranice
    function fetchAjax(url,funkcija){
        try{
            $.ajax({
                url : "assets/data/"+url,
                method : "get",
                dataType : "json",
                success : function(data){
                     // console.log(data)
                     funkcija(data);
                },
                error : function(xhr){
                     console.log(xhr)
                    throw("Ajax je nedostupan!")
                }
           });
        }catch(e){
           console.log(e);
        }
   }
   function displayNav(data){
       let output = '';
       for(link of data){
           output += ` <li class="nav-item">
                        <a class="nav-link" href="${link.href}">${link.naziv}</a>
                    </li>`
       }
       nav.innerHTML =  output;
   }
    function addItemToLS(nameLS,valueLS){
    try{
        localStorage.setItem(nameLS,JSON.stringify(valueLS));
    }catch(e){
        throw("Local storage nije dostupan!");
        console.log(e);
    }
    }
    function getItemFromLS(name){
    try{
        return JSON.parse(localStorage.getItem(name));
        throw("Local storage nije dostupan!");
        
    }catch(e){ 
        console.log(e);
    }
    }
    function displayLinksFooter(data){
        let output =``;
        for(link of data){
            output += `<li class="mb-4">${link.sadrzaj.ikonica}<a target="_blank" href=${link.href}>${link.sadrzaj.text}</a></li>`
        }
        usefulLinks.innerHTML=output;
    }
    //f-je za rad sa korpom
    function cartLength(){
        var gamesInLS = getItemFromLS("gamesCart");
    
        if(gamesInLS != null){
            number.innerHTML = gamesInLS.length
        }
    }
    function addGameInCart(e){
        e.preventDefault();
        let gameId = this.dataset.id;
        // console.log(gameId);
        let gamesInCart = getItemFromLS("gamesCart");

        if(gamesInCart){
            if(gameIsAlreadyInCart()){

                updateQuantity();
            }else{
                addAnotherGame();
                cartLength();
            }
        }else{
            addFristGame();
            cartLength();
        }
        function addFristGame(){
            let game = [];
            game[0] = {
                id : gameId,
                quantity : 1
            }
            addItemToLS("gamesCart",game);
        }
        function gameIsAlreadyInCart(){
             return gamesInCart.some(x=>x.id == gameId);
        }
        function updateQuantity(){
            let gameInLS = getItemFromLS("gamesCart");
            gameInLS.find(x=> x.id == gameId).quantity++;
            addItemToLS("gamesCart",gameInLS);
        }
        function addAnotherGame(){
            let gameInLS = getItemFromLS("gamesCart");
            gameInLS.push({
                id : gameId,
                quantity : 1
            });
            addItemToLS("gamesCart",gameInLS);
        }
        //Signalizacija da je dodato u korpu
        var that =  this;
        setTimeout(function(){
            that.innerHTML = `Dodaj u korupu <i class="fas fa-shopping-cart">`;
        },1000)
        this.innerHTML = "Dodato";
    }
   var location = window.location.pathname;

   if(location == "/" || location == "/index.html"){
    cartLength();
    fetchAjax("menu.json",displayNav);

    fetchAjax("links.json",displayLinksFooter);

    fetchAjax("games.json",saveGameToLs);

    displayNewestGames();
    hoverImg();
    //provera forme regularnim izrazima
    btnn.addEventListener('click',function(){
        let reEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        let reImePrezime = /^([A-ZČĆŽŠĐ][a-zšđčćž]{2,15})(\s[A-ZŠĐČĆŽ][a-zšđčćž]{2,20})+$/;
        let rb = form.radioBtn;
        var err = 0;

        checkInput(reImePrezime,imePrezime);

        checkInput(reEmail,email);

        if(ta.value == ""){
            ta.classList.add('border-err');
            ta.nextElementSibling.classList.add("show");
            err++;
        }else{
            ta.classList.add("border-success")
            ta.nextElementSibling.classList.remove("show");
        }
        function checkInput(regex,obj){
            if(!regex.test(obj.value)){
                err++
                obj.nextElementSibling.classList.add("show");
                obj.classList.add('border-err');
            }else{
                obj.classList.add("border-success")
                obj.nextElementSibling.classList.remove("show");
            }
        }
        if(rb.value == ""){
            err++;
            rbCheck.classList.add("show")
        }else{
            rbCheck.classList.remove("show")
        }
        if(err == 0){
            clearInput(ta);
            clearInput(imePrezime);
            clearInput(email);
            rez.classList.add("show");
            setTimeout(function(){
                rez.classList.add("hide");
                rez.classList.remove("show");
            },3000)
        }
        function clearInput(x){
            x.value = "";
            x.classList.remove("border-success");
            x.classList.remove("border-err");
        }
    })
   }
   //fje za index.html
   function displayNewestGames(){
    let allGames = getItemFromLS("games");
    
    let sortGames = allGames.sort(function(a,b){
        let d1 = new Date(a.datumIzlaska).getTime();
        let d2 = new Date(b.datumIzlaska).getTime();
        return d1 < d2 ? 1 : -1;
    })
   let brandNew = sortGames.slice(0,4);
   displayGames(brandNew,newGames);
    }
    function saveGameToLs(data){
        addItemToLS("games",data);
    }
    function hoverImg(){
        mockImg.addEventListener('mouseenter',function(){
            this.children[0].src = "assets/img/img2.png"
          });
          mockImg.addEventListener('mouseleave',function(){
            this.children[0].src = "assets/img/img22.png"
          });
    }
   if(location == "/shop.html"){
    cartLength();
    fetchAjax("games.json",saveGames);

    displaySort();

    fetchAjax("links.json",displayLinksFooter)

    fetchAjax("menu.json",displayNav);
  
    fetchAjax("categories.json",displayCategories);

    fetchAjax("company.json",displayCompany);

    fetchAjax("platforms.json",displayPlatforms);

    scrollTop();
   }
   
   //f-je za shop.html
    function scrollTop(){
        $('#scrollToTop').hide();
        $(window).scroll(function(){
            let top = $(this)[0].scrollY;
            // console.log(top)
            if(top>500){
                $('#scrollToTop').show();
            }else{
                $('#scrollToTop').hide();
            }
        })
        $('#scrollToTop').click(function(){
            $('html').animate({'scrollTop':'0'},1000)
        })
    }
    function displayCategories(data){
        let output ="<option value='0'>Izaberite</option>";
        for(cat of data){
            output += `<option value="${cat.id}">${cat.naziv}</option>`;
        }
        categories.innerHTML = output;
        addItemToLS("categories",data);
        $("#categories").change(filterCategories);
    }
    function displayCompany(data){
        let output ="<option value='0'>Izaberite</option>";
        for(company of data){
            output += `<option value="${company.id}">${company.naziv}</option>`;
        }
        companies.innerHTML = output;
        addItemToLS("companies",data);
        $("#companies").change(filterCompanies);
    }
    function displayPlatforms(data){
        let output = "";
        for(platform of data){
            output += `<li><input type="checkbox" value="${platform.id}" class="console" name="console "/>${platform.naziv}`;
        }
        platforms.innerHTML = output;
        $(".console").click(filterPlatform);
    }
    function displaySort(){
        let data = [
            {"sortType": "asc","value": "Cena - Rastuce" },
            {"sortType": "desc","value": "Cena - Opadajuce" }
        ]
        let html='<option value="0">Izaberite</option>';
        for(obj of data){
            html += `<option value="${obj.sortType}">${obj.value}</option>`
        }
        sort.innerHTML = html;
        $("#sort").change(sortGames);
    }
    function displayGames(data,idBlok){
    
        let preOrderDate = new Date().getTime();
        let output = ``;
        for(game of data){
            var d1 = new Date(game.datumIzlaska).getTime();
            if(d1 > preOrderDate){
                output += `<div class="col-md-6 col-lg-3 mb-5">
                <div class="card">
                    <img src="${game.slika.src}" alt="">
                    <div class="card-body">
                        <h6>${game.naziv}</h6>
                        <div class="cena">
                            ${gamePrice(game.cena)}
                        </div>
                        <a href="#" data-id="${game.id}" class="addToCart d-block btn btn-warning">Dodaj u korpu <i class="fas fa-shopping-cart"></i></a>
                    </div>
                    <span class="preoder text-uppercase font-weight-bold p-1">Preorder</span>
                </div>
            </div>`
            }else{
            output += `   <div class="col-md-6 col-lg-3 mb-5">
                    <div class="card">
                        <img src="${game.slika.src}" alt="">
                        <div class="card-body">
                            <h6>${game.naziv}</h6>
                            <div class="cena">
                                ${gamePrice(game.cena)}
                            </div>
                            <a href="#" data-id="${game.id}" class="addToCart d-block btn btn-warning">Dodaj u korpu <i class="fas fa-shopping-cart"></i></a>
                        </div>
                    </div>
                </div>`
            }    
        }
        idBlok.innerHTML = output;
        $(".addToCart").click(addGameInCart)
    }
    function gamePrice(obj){
        let price= '';
        obj.staraCena != null ? price += `<p class="line-through text-right">${obj.staraCena},00RSD</p><p class="text-right">${obj.novaCena},00RSD</p>` : price+= `<p class="text-right">${obj.novaCena},00RSD</p>`;
        return price;
    }
    function filterCategories(){
    let selectedCat = parseInt(this.value);
    let allGames = getItemFromLS("games");
    if(selectedCat == '0'){
        
        displayGames(getItemFromLS("games"),games);
    }else{
        let selectedGames = allGames.filter(x=>x.kategorija.includes(selectedCat))
        displayGames(selectedGames,games);
    }   
    }
    function filterCompanies(){
    let selectedComp = parseInt(this.value);
    console.log(selectedComp)
    let allGames = getItemFromLS("games");
    if(selectedComp == '0'){
        displayGames(getItemFromLS("games"),games);
    }else{
        let selectedGames = allGames.filter(x=>x.kompanija == selectedComp)
        displayGames(selectedGames,games);
    }   
    }
    function filterPlatform(){
        
        let selectedPlatforms = [];
        let allGames = getItemFromLS("games");
        $(".console:checked").each(function(el){
            selectedPlatforms.push(parseInt($(this).val()));
        });
        if(selectedPlatforms != 0){
            var selectedGames = allGames.filter(x=> selectedPlatforms.includes(x.platforma));
            displayGames(selectedGames,games);
        }else{
            displayGames(allGames,games);
        }
        
    }
    function sortGames(){
        let sortType = $("#sort").val();
        let allGames = getItemFromLS("games");
        if(sortType=="asc"){
            allGames.sort((a,b) => a.cena.novaCena > b.cena.novaCena ? 1 : -1)
        }else{
            allGames.sort((a,b) => a.cena.novaCena < b.cena.novaCena ? 1 : -1)
        }
        displayGames(allGames,games);
    }
    function saveGames(data){
        addItemToLS("games",data);
        displayGames(data,games);
    }
    if(location == "/author.html"){
        fetchAjax("menu.json",displayNav);
        cartLength();
        fetchAjax("links.json",displayLinksFooter);
    }
    if(location == "/cart.html"){
        fetchAjax("menu.json",displayNav);

        fetchAjax("links.json",displayLinksFooter);

        let gamesInCart = getItemFromLS("gamesCart");
        if(gamesInCart == null){
            displayEmptyCart();
        }
        else{
            displayCart();
        }
        function displayEmptyCart(){
            cartTable.innerHTML = `<p class='cart-p'>Vaša korpa je prazna! Idite na <a href="shop.html">shop</a></p>`;
        }
        function displayCart(){
            let gamesInCart = getItemFromLS("gamesCart");
            fetchAjax("games.json",saveGameToLs);
            let allGames = getItemFromLS("games");
            
            let gamesForTable = [];
            gamesForTable = allGames.filter(game=>{
                for(g of gamesInCart){
                    if(game.id == g.id){
                        game.quantity = g.quantity;
                        return true;
                    }
                }
                return false;
            })
            displayTable(gamesForTable);
            // console.log(gamesForTable)
        }
        function displayTable(games){
            var output = `
            <table class="table table-striped table-dark">
                <thead>
                    <tr>
                        <th scope="col">Ime</th>
                        <th scope="col">Slika</th>
                        <th scope="col">Kolicnina</th>
                        <th scope="col">Ukupno</th>
                        <th scope="col">Izbrisi</th>
                    </tr>
                </thead>
                <tbody>`;
                
            for(let game of games) {
            output +=`
            <tr>
                <th scope="row">${game.naziv}</th>
                <td><img src="${game.slika.src}" alt="${game.slika.alt}" class="slika-cart"/></td>
                <td>${game.quantity}</td>
                <td class="productSum">${game.quantity * game.cena.novaCena},00 RSD</td>
                <td><button class="btn btn-outline-danger deleteBtn" data-id=${game.id}>Obrisi</button>
                </td>
            </tr>
            `
            }
            output +=`</tbody></table>`;
            output +=`
            <div class="row d-flex justify-content-end"">
                <p id="purchase" class="btn btn-success mr-3">Potvrdi</p>
                <p id="removeAll" class="btn btn-danger">Izbriši sve</p>
            </div>
            `
            cartTable.innerHTML = output;
            $("#removeAll").click(deleteCart);
            $("#purchase").click(makeOrder);
             $(".deleteBtn").click(removeCart)
             sumPrice();
        }
        function removeCart(){
            let itemId = this.dataset.id;
            console.log(itemId);
            let games = getItemFromLS("gamesCart");
            
            let filtered = games.filter(g => g.id != itemId);
            
            addItemToLS("gamesCart",filtered);
            
            displayCart();
            
            sumPrice();
        }
      
        function sumPrice(){
            var x =document.querySelectorAll(".productSum");
            var sum=0;
            for(var i=0;i<x.length;i++){
            sum += Number((x[i].textContent).split(",")[0]);
             }
             totalSum.innerHTML = `Vas ukupuni racun je: ${sum},00RSD`;
        }
        document.body.addEventListener('click',removeFromCart);
        function removeFromCart(e){
            if(e.target.classList.contains('deleteBtn')){
                var itemId = e.target.dataset.id;  
            }
            let games = getItemFromLS("gamesCart");
    
            let filtered = games.filter(g => g.id != itemId);
            
            addItemToLS("gamesCart",filtered);
            
            displayCart();
        }
      
      function deleteCart(){
        localStorage.removeItem("gamesCart");

        cartTable.innerHTML = `<p class='cart-p'>Vaša korpa je prazna! Idite na <a href="shop.html">shop</a></p>`;

         totalSum.innerHTML = "";
      }
      function makeOrder(){
          alert("Uspesna porudzbina");

          localStorage.removeItem("gamesCart");
          cartTable.innerHTML = `<p class='cart-p'>Vaša korpa je prazna! Idite na <a href="shop.html">shop</a></p>`;

         totalSum.innerHTML = "";
      }  
    }
    
}
