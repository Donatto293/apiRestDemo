import axios from 'axios'

const tasksApi =axios.create({
  baseURL: "http://localhost:8000/api/v2",
});

//obtener productos
export const getAllProducts= ()=> tasksApi.get("/product/");

//crear productos
export const createProduct = (product)=>{

  tasksApi.post("/product/", product)
}

//obtener categorias de los productos

export const getAllCategories= ()=> tasksApi.get("/categories/");

//obtener las subcategorias de los productos
export const getAllSubcategories=()=> tasksApi.get("/subcategories/");

//eliminar un producto
export const deleteProduct =(id) => tasksApi.delete("/product/"+id+"/");

//actualizar un producto 
export const updateProduct =(id, product)=> tasksApi.put("/product/"+id+"/", product);

//obtener una solo producto
export const getProduct =(id)=> tasksApi.get("/product/"+id+"/")

