const API = 'http://localhost:3000/api/products';

async function loadProducts() {
  const res = await fetch(API);
  const products = await res.json();
  const tbody = document.getElementById('productTableBody');
  tbody.innerHTML = '';

  products.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.product_name}</td>
      <td>${p.category || ''}</td>
      <td>${p.price ?? ''}</td>
      <td>${p.stock ?? ''}</td>
      <td>${p.description || ''}</td>
      <td>
        <button onclick="editProduct(${p.id})">Edit</button>
        <button onclick="deleteProduct(${p.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function saveProduct() {
  const id = document.getElementById('productId').value;
  const body = {
    product_name: document.getElementById('product_name').value.trim(),
    category: document.getElementById('category').value.trim(),
    price: parseFloat(document.getElementById('price').value) || null,
    stock: parseInt(document.getElementById('stock').value) || null,
    description: document.getElementById('description').value.trim(),
  };

  if (!body.product_name) {
    alert('Product name is required');
    return;
  }

  if (id) {
    // UPDATE
    await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } else {
    // CREATE
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  resetForm();
  loadProducts();
}

async function editProduct(id) {
  const res = await fetch(`${API}/${id}`);
  const p = await res.json();

  document.getElementById('productId').value = p.id;
  document.getElementById('product_name').value = p.product_name || '';
  document.getElementById('category').value = p.category || '';
  document.getElementById('price').value = p.price ?? '';
  document.getElementById('stock').value = p.stock ?? '';
  document.getElementById('description').value = p.description || '';
  document.getElementById('formTitle').textContent = 'Edit Product';
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  loadProducts();
}

function resetForm() {
  document.getElementById('productId').value = '';
  document.getElementById('product_name').value = '';
  document.getElementById('category').value = '';
  document.getElementById('price').value = '';
  document.getElementById('stock').value = '';
  document.getElementById('description').value = '';
  document.getElementById('formTitle').textContent = 'Add Product';
}

// Load the list as soon as the page opens
loadProducts();