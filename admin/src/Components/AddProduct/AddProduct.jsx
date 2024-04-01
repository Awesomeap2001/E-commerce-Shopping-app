import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {

    const [image, setImage] = useState(false)
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "women",
        new_price: "",
        old_price: ""
    })

    const imageHandler = (e) => {
        setImage(e.target.files[0])
    }

    const changehandler = (e) => {
        const name = e.target.name;
        const value = e.target.value
        setProductDetails({ ...productDetails, [name]: value })
    }

    const Add_Product = async () => {
        console.log(productDetails)
        let responseData;
        let product = productDetails;

        let formData = new FormData();
        formData.append('product', image);

        await fetch('http://localhost:4000/upload', {
            method: "POST",
            headers: {
                Accept: 'application/json'
            },
            body: formData
        }).then((resp) => resp.json()).then((data) => { responseData = data })

        if (responseData.success) {
            product.image = responseData.image_url
            console.log(product)

            await fetch('http://localhost:4000/addproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            }).then((res) => res.json()).then((data) => {
                data.success ? alert("Product Added") : alert("Failed to Add Product")
            })
        }
    }

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input type="text" name='name' placeholder='Type here' value={productDetails.name} onChange={changehandler} />
            </div>

            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input type="text" name='old_price' placeholder='Type here' value={productDetails.old_price} onChange={changehandler} />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input type="text" name='new_price' placeholder='Type here' value={productDetails.new_price} onChange={changehandler} />
                </div>
            </div>

            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select name="category" className='addproduct-selector' value={productDetails.category} onChange={changehandler}>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>

            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumbnail-img' alt="" />
                </label>
                <input type="file" onChange={imageHandler} name='image' id='file-input' hidden />
            </div>

            <button onClick={() => { Add_Product() }} className='addproduct-btn'>ADD</button>

        </div>
    )
}

export default AddProduct