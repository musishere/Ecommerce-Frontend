import ProductCart from '../components/ProductCart';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Skeleton } from '../components/Loading';
import { addToCart } from '../redux/reducer/CartReducer';
import { customError } from '../types/api-types';
import { CartItems } from '../types/types';

import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from '../redux/api/productApi';

const Search = () => {
  const {
    data: categoriesResponse,
    isLoading: loadigCategories,
    isError,
    error,
  } = useCategoriesQuery('');

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [maxPrice, setsMaxPrice] = useState(10000);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const {
    isLoading: productLoading,
    data: searchedData,
    isError: productIsError,
    error: productError,
  } = useSearchProductsQuery({
    search,
    sort,
    category,
    page,
    price: maxPrice,
  });
  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItems) => {
    if (cartItem.stock < 1) return toast.error('Out of Stock');
    dispatch(addToCart(cartItem));
    toast.success('Added to cart');
  };

  const isNextPage = true;
  const isPrevPage = true;

  if (isError) {
    const err = error as customError;
    toast.error(err.data.message);
  }

  if (productIsError) {
    const err = productIsError as customError;
    toast.error(err.data.message);
  }

  return (
    <div className='product-search-page'>
      <aside>
        <h1>Filters</h1>
        <div>
          <h3>Sort</h3>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value=''>None</option>
            <option value='asc'>Price (Low to High)</option>
            <option value='dsc'>Price (High to Low)</option>
          </select>
        </div>

        <div>
          <h3>Max Price: {maxPrice || ''}</h3>
          <input
            type='range'
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setsMaxPrice(Number(e.target.value))}
          ></input>
        </div>

        <div>
          <h3>Category</h3>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value=''>ALL</option>
            {loadigCategories === false &&
              categoriesResponse?.categories.map((i) => (
                <option value={i} key={i}>
                  {i.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type='text'
          placeholder='Search by name...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {productLoading ? (
          <Skeleton length={10} />
        ) : (
          <div className='search-product-list'>
            {searchedData?.products.map((i) => (
              <ProductCart
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler}
                photo={i.photo}
              />
            ))}
          </div>
        )}

        {searchedData && searchedData.totalPage > 1 && (
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <span>
              {page} of {searchedData.totalPage}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;
