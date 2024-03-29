// search Function

const search = () => {
  const searchBox = document.getElementById("search-item").value.toUpperCase();
  const storeItems = document.getElementById("product-list");
  const product = document.querySelectorAll(".Card");
  const pname = storeItems.getElementsByTagName("h5");

  for (let i = 0; i < pname.length; i++) {
    let match = product[i].getElementsByTagName("h5")[0];

    if (match) {
      let textvalue = match.textContent || match.innerHTML;

      if (textvalue.toUpperCase().indexOf(searchBox) > -1) {
        // input > -1
        product[i].style.display = "";
      } else {
        product[i].style.display = "none";
      }
    }
  }
};
