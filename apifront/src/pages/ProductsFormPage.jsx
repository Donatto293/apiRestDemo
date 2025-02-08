import {useForm} from 'react-hook-form'
import {createProduct, getAllCategories, getAllSubcategories} from '../api/tasks.api'
import { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'


export function ProductsFormPage() {

  //para las categorias de los productos
  const [categories, setCategories]=useState([])
  const [subcategories, setSubcategories]= useState([])
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  const {register, handleSubmit}= useForm()
  const navigate =useNavigate()

  //funcion para obtener las categorias
  useEffect(()=>{
    async function fetchdata(params) {
      try{
        const categoryRes = await getAllCategories();
        const subcategoryRes= await getAllSubcategories();
        setCategories(categoryRes.data);
        setSubcategories(subcategoryRes.data);
      }catch(error){
        console.error("Error fetching categories or subcategories", error)
      }
    }
    fetchdata();
  },[]);

  //const que filtra las subcategorias segun la categoria seleccionada
  const handleCategoryChange = (categoryId) => {
    const filtered = subcategories.filter(sub => sub.category === parseInt(categoryId));
    setFilteredSubcategories(filtered);
  };


  //subir el producto
  const onSubmit = handleSubmit(async data => {
    const res= await createProduct(data)
    console.log(res)
    navigate("/tasks");
  })





  return (
    <form onSubmit={onSubmit}>

    <input type="text" placeholder="Name"
      {...register("name", {required:true})}
    />
    <textarea rows="3" placeholder="Description"
        {...register("description", {required:true})}
    ></textarea>
    <input type="text" placeholder="Price"
      {...register("price", {required:true})}
    />
    {/* Lista desplegable para categorías */}
    <select
          {...register("category", { required: true })}
          onChange={(e) => handleCategoryChange(e.target.value)}
      >
          <option value="">Select a category</option>
          {categories.map(category => (
              <option key={category.id} value={category.id}>
                  {category.name}
              </option>
          ))}
      </select>
      {/* Lista desplegable para subcategorías */}
      <select {...register("Subcategory", { required: true })}>
          <option value="">Select a subcategory</option>
          {filteredSubcategories.map(subcategory => (
              <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
              </option>
          ))}
      </select>
    <button>save</button>
    </form>
  )
}
  