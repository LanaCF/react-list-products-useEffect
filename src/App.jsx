import { useEffect, useState } from "react";
import { getProducts } from "./API/getProducts";
import { getCategory } from "./API/getCategory";

const App = () => {
  const [runFetch, setRunFetch] = useState(false);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [select, setSelect] = useState(1);
  const [addProduct, setAddProduct] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [indexFilterCategory, setIndexFilterCategory] = useState('all');

  const isButtonDisabled = !addProduct || !addPrice;

  useEffect(() => {
    (async () => {
      try {
        const newProducts = await getProducts();
        setProducts(newProducts);

        const newCategory = await getCategory();
        setCategory(newCategory);

        console.log(newProducts);
        console.log(newCategory);
      } catch(error) {
        console.log('Fetch error!!!');
      }
    })()    // анонімна функція, яка сама викликається

    console.log('out of async func');
  }, [runFetch]);  

  // ADD ====================================================

  const addNewProduct = async () => {
    try {
      if (!category) {
        console.error('Category is undefined');
        return;
      }

      const response = await fetch('http://localhost:3000/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: addProduct,
          price: +addPrice,
          category: category.find(item => item.id === select).id
        }),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
        setAddProduct("");
        setAddPrice("");
        setSelect(1);
        console.log("New product added:", newProduct);
        console.log(products);
      } else {
        console.error('Failed to add new product:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding new product:', error);
    }
  };

  // FILTER ====================================================

  useEffect(() => {
    (async () => {
      try {
        const filteredProducts = await filterProductsCategory();
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error filtering products by category:', error);
      }
    })();
  }, [indexFilterCategory]);

  const filterProductsCategory = async () => {
    try {
      let filteredProducts;
      if (indexFilterCategory === 'all') { // Перевірка чи обрано всі категорії
        filteredProducts = await getProducts(); // Отримання всіх продуктів
      } else {
        const response = await fetch(`http://localhost:3000/product?category=${indexFilterCategory}`);
        filteredProducts = await response.json();
      }
      return filteredProducts;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  };

  // ====================================================

  return (
    <div className="container">
      <input 
        onChange={ e => setAddProduct(e.target.value) }
        type="text" 
        className="productTitle"
        value={ addProduct }
        placeholder="Назва товару"
      />

      <input 
        onChange={ e => setAddPrice(e.target.value) }
        type="text" 
        className="productPrice" 
        value={ addPrice }
        placeholder="Ціна товару"
      />

      <select onChange={ e => setSelect(+e.target.value) } name="productCategory" className="productCategory" value={ select }>
        {
          category.map(item => <option value={ item.id } key={ item.id }> { item.title } </option>)
        }
      </select>

      <button onClick={ addNewProduct } className="addProduct" disabled={ isButtonDisabled }>Додати</button>

      <div className="filter-wrapper">
        <div className="filter-text-box">
          <p className="filter-text">
            Фільтрувати по категорії:&nbsp;
          </p>
        </div>
        
        <div className="filter">
          <select onChange={ e => setIndexFilterCategory(e.target.value) } name="productCategorySelect" className="productCategorySelect" value={ indexFilterCategory }>
            <option value="all">Всі категорії</option>            
            {
              category.map(item => <option value={ item.id } key={ item.id }> { item.title } </option>)
            }
          </select>
        </div>
      </div>

      {
        products.map(product => <p key={ product.id }>{ product.title }: { product.price } грн. (категорія { product.category }) </p>)
      }
      <p>
        Всього:&nbsp;
        {
          products.reduce((acc, item) => acc + item.price, 0)
        }

        &nbsp;грн.
      </p>
    </div>
  );
}

export default App;






