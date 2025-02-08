import {useNavigate} from 'react-router-dom'

export function ProductCard({product}) {

  const navigate =useNavigate()
  return (
    <div style={{background:"black"}}
       onClick={()=>{
        navigate('/product/'+ product.id )
       }}
    
    > 
    <h1>{product.name}</h1>
    <p>{product.description}</p>
    <h2>{product.price}</h2>
    <h2>{product.category}</h2>
    <h2>{product.Subcategory}</h2>
    <hr/>
    </div>
  )
}

