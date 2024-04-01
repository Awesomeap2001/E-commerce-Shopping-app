import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
    return (
        <div className='descriptionbox'>
            <div className="descriptionbox-navigator">
                <div className="descriptionbox-nav-box">Description</div>
                <div className="descriptionbox-nav-box fade">Reviews (122)</div>
            </div>
            <div className="descriptionbox-description">
                <p>An e-commerce website is an online platform that facilitates the buying and selling of prooducts or services over the internet. It serves as a virtual marketplace where businesses and individuals can show their products, Interact with the customers, and conduct transactions without the need for physical presence. E-commerce websites have gained immense popularity due to their convenience, accessibility and global reach they offer.</p>
                <p>E-commerce websites typically display products or services along with the detailed description, images, prices and any available variations. Each product usuallly has its own dedicated page with relevent information</p>
            </div>
        </div>
    )
}

export default DescriptionBox