import React, { useEffect, useState } from 'react'
import './NewCollections.css'
import Item from '../Item/Item';

const NewCollections = () => {
    const [new_collection, setNew_collection] = useState([])

    const fetchNewCollections = async () => {
        const res = await fetch("http://localhost:4000/newcollections")
        const data = await res.json()
        setNew_collection(data)
    }

    useEffect(() => {
        fetchNewCollections()
    }, [])

    return (
        <div className='newcollections'>
            <h1>NEW COLLECTIONS</h1>
            <hr />
            <div className="collections">
                {
                    new_collection.map((item, i) => {
                        return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
                    })
                }
            </div>
        </div>
    )
}

export default NewCollections