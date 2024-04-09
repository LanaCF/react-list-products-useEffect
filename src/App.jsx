import { useEffect, useState } from "react";
import { getProducts } from "./API/getProducts";
import { getCategory } from "./API/getCategory";
import Pages from "./components/Pages";
import getTotalProductsCount from "./API/getTotalProductsCount";
import { getAllProducts } from "./API/getAllProducts";

const App = () => {
  const [runFetch, setRunFetch] = useState(false);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [select, setSelect] = useState('');
  const [addProduct, setAddProduct] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [indexFilterCategory, setIndexFilterCategory] = useState('all');

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCost, setTotalCost] = useState([]);

  const quantityProductPerPage = 10;

  const isButtonDisabled = !addProduct || !addPrice;

  useEffect(() => {
    (async () => {
      try {
        const newProducts = await getProducts();
        setProducts(newProducts);

        const newCategory = await getCategory();
        setCategory(newCategory);

        const totalProductsCount = await getTotalProductsCount();
        setTotalPages(Math.ceil(totalProductsCount / quantityProductPerPage));

        const totalCostProducts = await getAllProducts();
        setTotalCost(totalCostProducts);
      } catch(error) {
        console.log('Fetch error!!!');
      }
    })()
  }, [runFetch]); 

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  // const handleCategoryChange = (categoryId) => {
  //   setIndexFilterCategory(categoryId);
  //   setCurrentPage(0);
  //   setShowPagination(categoryId === 'all');
  // };

  // const filteredProducts = indexFilterCategory === 'all' ? products : products.filter(product => product.category === indexFilterCategory);
  // const paginatedProducts = filteredProducts.slice((currentPage - 1) * quantityProductPerPage, currentPage * quantityProductPerPage);

  // ADD ====================================================

  const addNewProduct = async () => {
    try {
      if (!category || category.length === 0) {
        console.error('Category is undefined or empty');
        return;
      }

      const selectedCategory = category.find(item => item.id.toString() === select);
      if (!selectedCategory) {
        console.error('Selected category is not found');
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
          category: selectedCategory.id
        }),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
        setAddProduct("");
        setAddPrice("");
        setSelect("");
        setRunFetch(prev => !prev);
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

        if (indexFilterCategory === 'all') {
          const totalProductsCount = await getTotalProductsCount();
          setTotalPages(Math.ceil(totalProductsCount / quantityProductPerPage));
        } else {
          setTotalPages(1); // Приховуємо пагінацію, якщо обрано конкретну категорію
        }
      } catch (error) {
        console.error('Error filtering products by category:', error);
      }
    })();
  }, [indexFilterCategory]);

  const filterProductsCategory = async (page = 0, limit = 10) => {
    try {
      let filteredProducts;
      if (indexFilterCategory === 'all') {
        filteredProducts = await getProducts(page, limit);
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
      <div className="navigation">
        <div className="navigation__title-box">
          <h1>
            СПИСОК ПРОДУКТІВ
          </h1>
        </div>

        <div className="navigation__btn-box">
          <Pages currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} setProducts={setProducts} />
        </div>
      </div>
      
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

      <select onChange={ e => setSelect(e.target.value) } name="productCategory" className="productCategory" value={ select }>
      <option value=""></option>  
        {
          category.map(item => <option value={ item.id } key={ item.id }> { item.title } </option>)
        }
      </select>

      <button onClick={ addNewProduct } className="addProduct" disabled={ isButtonDisabled }>Додати</button>

      <div className="filter-wrapper">
        <div className="filter-block">
          <div className="filter-text-box">
            <p className="filter-text">
              Фільтрувати по категорії:&nbsp;
            </p>
          </div>
          
          <div className="filter">
            <select onChange={ e => setIndexFilterCategory(e.target.value) } name="productCategorySelect" className="productCategorySelect" value={ indexFilterCategory }>
              <option value="all"></option>
              <option value="all">Усі категорії</option>            
              {
                category.map(item => <option value={ item.id } key={ item.id }> { item.title } </option>)
              }
            </select>
          </div>
        </div>

        <div className="total-prod">
          <p className="total-prod-item">
            Всього:&nbsp;
            {
              totalCost.reduce((acc, item) => acc + item.price, 0)
            }

        &nbsp;грн.
        </p>
        </div>
      </div>

      {
        products.map(product => <p key={ product.id } className="product"><b>{ product.title }:</b>&nbsp;&nbsp;&nbsp;{ product.price } грн.&nbsp;&nbsp;&nbsp;<i>(категорія { product.category }</i>) </p>)
      }
      <p className="total">
        Всього на сторінці:&nbsp;
        {
          products.reduce((acc, item) => acc + item.price, 0)
        }

        &nbsp;грн.
      </p>
    </div>
  );
}

export default App;









