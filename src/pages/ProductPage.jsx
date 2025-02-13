import * as bootstrap from 'bootstrap';
import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../api/apiFetch';
import ProductModal from '../component/ProductModal';
import Pagination from '../component/Pagination';

const { VITE_URL, VITE_PATH } = import.meta.env;

// let token = null;

function Product() {
  const productModalRef = useRef(null);
  const [modalType, setModalType] = useState('');
  const [templateData, setTemplateData] = useState({
    id: '',
    imageUrl: '',
    title: '',
    category: '',
    unit: '',
    origin_price: 0,
    price: 0,
    description: '',
    content: '',
    is_enabled: 0,
    imagesUrl: [],
  });

  const openModal = (product, type) => {
    setTemplateData({
      id: product.id || '',
      imageUrl: product.imageUrl || '',
      title: product.title || '',
      category: product.category || '',
      unit: product.unit || '',
      origin_price: product.origin_price || 0,
      price: product.price || 0,
      description: product.description || '',
      content: product.content || '',
      is_enabled: product.is_enabled || 0,
      imagesUrl: product.imagesUrl || [],
    });
    productModalRef.current.show();
    setModalType(type);
  };

  useEffect(() => {
    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false,
    });

    document
      .querySelector('#productModal')
      .addEventListener('hide.bs.modal', () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
  }, []);

  useEffect(() => {
    // token = document.cookie.replace(
    //   /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
    //   '$1'
    // );

    getProducts();
  }, []);

  const closeModal = () => {
    productModalRef.current.hide();
  };

  const handleModalInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setTemplateData((prevData) => ({
      ...prevData,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (index, value) => {
    setTemplateData((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages[index] = value;

      if (
        value !== '' &&
        index === newImages.length - 1 &&
        newImages.length < 5
      ) {
        newImages.push('');
      }

      if (newImages.length > 1 && newImages[newImages.length - 1] === '') {
        newImages.pop();
      }

      return { ...prevData, imagesUrl: newImages };
    });
  };

  const handleAddImage = () => {
    setTemplateData((prevData) => ({
      ...prevData,
      imagesUrl: [...prevData.imagesUrl, ''],
    }));
  };

  const handleRemoveImage = () => {
    setTemplateData((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages.pop();
      return { ...prevData, imagesUrl: newImages };
    });
  };

  //API
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const getProducts = async (page = 1) => {
    const url = `${VITE_URL}/api/${VITE_PATH}/admin/products?page=${page}`;

    const data = await apiFetch(url, 'GET', true);

    setProducts(data.products);
    setPagination(data.pagination);
  };

  const addProductData = async (id) => {
    const url = `${VITE_URL}/api/${VITE_PATH}/admin/product`;

    const body = JSON.stringify({
      data: {
        ...templateData,
        origin_price: Number(templateData.origin_price),
        price: Number(templateData.price),
        is_enabled: templateData.is_enabled ? 1 : 0,
        imagesUrl: templateData.imagesUrl,
      },
    });

    const data = await apiFetch(url, 'POST', true, body);

    alert('新增成功', data.message);

    closeModal();
    getProducts(pagination);
  };

  const updateProductData = async (id) => {
    const url = `${VITE_URL}/api/${VITE_PATH}/admin/product/${id}`;

    const body = JSON.stringify({
      data: {
        ...templateData,
        origin_price: Number(templateData.origin_price),
        price: Number(templateData.price),
        is_enabled: templateData.is_enabled ? 1 : 0,
        imagesUrl: templateData.imagesUrl,
      },
    });

    const data = await apiFetch(url, 'PUT', true, body);

    alert('更新成功', data.message);

    closeModal();
    getProducts(pagination);
  };

  const delProductData = async (id) => {
    const url = `${VITE_URL}/api/${VITE_PATH}/admin/product/${id}`;

    const data = await apiFetch(url, 'DELETE', true);

    alert('刪除成功', data.message);

    closeModal();
    getProducts(pagination);
  };

  return (
    <>
      <div className='container'>
        <div className='text-end mt-4'>
          <button
            className='btn btn-primary'
            onClick={() => openModal({}, 'new')}
          >
            建立新的產品
          </button>
        </div>
        <table className='table mt-4'>
          <thead>
            <tr>
              <th width='120'>分類</th>
              <th>產品名稱</th>
              <th width='120'>原價</th>
              <th width='120'>售價</th>
              <th width='100'>是否啟用</th>
              <th width='120'>編輯</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.category}</td>
                  <td>{product.title}</td>
                  <td>{product.origin_price}</td>
                  <td>{product.price}</td>
                  <td>
                    {product.is_enabled ? (
                      <span className='text-success'>啟用</span>
                    ) : (
                      <span>未啟用</span>
                    )}
                  </td>
                  <td>
                    <div className='btn-group'>
                      <button
                        type='button'
                        className='btn btn-outline-primary btn-sm'
                        onClick={() => openModal(product, 'edit')}
                      >
                        編輯
                      </button>
                      <button
                        type='button'
                        className='btn btn-outline-danger btn-sm'
                        onClick={() => openModal(product, 'delete')}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='5'>尚無產品資料</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination pagination={pagination} changePage={getProducts} />
      </div>

      <ProductModal
        modalType={modalType}
        templateData={templateData}
        closeModal={closeModal}
        handleModalInputChange={handleModalInputChange}
        handleImageChange={handleImageChange}
        handleAddImage={handleAddImage}
        handleRemoveImage={handleRemoveImage}
        addProductData={addProductData}
        updateProductData={updateProductData}
        delProductData={delProductData}
      />
    </>
  );
}

export default Product;
